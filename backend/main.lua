local logger = require("logger")
local millennium = require("millennium")
local fs = require("fs")

local function trim(s)
    return (tostring(s):gsub("^%s+", ""):gsub("%s+$", ""))
end

local function get_plugin_dir()
    local src = debug.getinfo(1, "S").source or ""
    src = src:gsub("^@", "")
    return fs.parent_path(fs.parent_path(src))
end

local function copy_rank_icons()
    -- Wrap everything in pcall to prevent crashes
    local success, err = pcall(function()
        local plugin_dir = get_plugin_dir()
        local ranks_dir = fs.join(plugin_dir, "static", "ranks")
        local steam_path = millennium.steam_path()
        local dest_dir = fs.join(steam_path, "steamui", "DotaRanks")

        logger:info("[dotastats] plugin_dir: " .. tostring(plugin_dir))
        logger:info("[dotastats] ranks_dir: " .. tostring(ranks_dir))
        logger:info("[dotastats] dest_dir: " .. tostring(dest_dir))

        -- Create destination directory if it doesn't exist
        if not fs.exists(dest_dir) then
            local ok, create_err = fs.create_directories(dest_dir)
            if not ok then
                logger:error("[dotastats] failed to create dest_dir: " .. tostring(create_err))
                return
            end
        end

        -- Check if icons are already copied
        local sentinel = fs.join(dest_dir, "rank_icon_1_1.png")
        if fs.exists(sentinel) then
            logger:info("[dotastats] rank icons already present, skipping copy")
            return
        end

        -- Copy all PNG files from ranks directory
        if not fs.exists(ranks_dir) then
            logger:error("[dotastats] ranks_dir does not exist: " .. tostring(ranks_dir))
            return
        end

        local entries = fs.list(ranks_dir)
        if not entries then
            logger:error("[dotastats] failed to list ranks_dir")
            return
        end

        local copied = 0
        for _, entry in ipairs(entries) do
            -- entry might be just a string (filename) or a table with fields
            local filename = type(entry) == "string" and entry or entry.name or entry.path
            if filename and fs.extension(filename) == ".png" then
                local src = fs.join(ranks_dir, filename)
                local dst = fs.join(dest_dir, filename)
                
                -- Only copy if source is actually a file
                if fs.is_file(src) then
                    local ok, copy_err = fs.copy(src, dst)
                    if ok then
                        copied = copied + 1
                    else
                        logger:error("[dotastats] failed to copy " .. tostring(filename) .. ": " .. tostring(copy_err))
                    end
                end
            end
        end

        logger:info("[dotastats] copied " .. tostring(copied) .. " rank icons")
    end)
    
    if not success then
        logger:error("[dotastats] copy_rank_icons crashed: " .. tostring(err))
    end
end

local function on_load()
    local success, err = pcall(function()
        logger:info("[dotastats] loading, Millennium " .. millennium.version())
        -- Temporarily disable icon copying to test
        -- copy_rank_icons()
        logger:info("[dotastats] skipping icon copy for testing")
        millennium.ready()
    end)
    
    if not success then
        logger:error("[dotastats] on_load crashed: " .. tostring(err))
        -- Still call ready to prevent blocking
        pcall(function() millennium.ready() end)
    end
end

local function on_frontend_loaded()
    logger:info("[dotastats] frontend loaded")
end

local function on_unload()
    logger:info("[dotastats] unloading")
end

local function read_stratz_token()
    local token_path = fs.join(get_plugin_dir(), "backend", "stratz_token.txt")
    
    if not fs.exists(token_path) then
        return nil, "stratz_token.txt not found"
    end
    
    local f = io.open(token_path, "rb")
    if not f then
        return nil, "failed to open stratz_token.txt"
    end
    
    local token = f:read("*a") or ""
    f:close()
    token = trim(token)
    
    if token == "" then
        return nil, "stratz_token.txt is empty"
    end
    
    return token, nil
end

local function json_escape(s)
    s = tostring(s)
    s = s:gsub("\\", "\\\\")
    s = s:gsub('"', '\\"')
    s = s:gsub("\r", "\\r")
    s = s:gsub("\n", "\\n")
    return s
end

local function stratz_graphql(steam_account_id)
    local token, err = read_stratz_token()
    if not token then
        return nil, err
    end

    -- ranks.rank is the season rank id; we take the latest entry.
    local query = [[query PlayerCard($steamAccountId: Long!) { player(steamAccountId: $steamAccountId) { steamAccountId matchCount winCount ranks { rank } leaderboardRanks(skip: 0, take: 1) { rank } } }]]
    local body = string.format(
        '{"query":"%s","variables":{"steamAccountId":%s}}',
        json_escape(query),
        tostring(steam_account_id)
    )

    -- Check if we're on Windows (PowerShell approach)
    local is_windows = package.config:sub(1, 1) == "\\"
    if not is_windows then
        return nil, "STRATZ backend is currently Windows-only"
    end

    -- Use -WindowStyle Hidden to prevent CMD window flash
    local ps = string.format(
        'powershell -NoProfile -WindowStyle Hidden -Command "$ErrorActionPreference=\\"Stop\\"; $u=\\"https://api.stratz.com/graphql\\"; $h=@{ Authorization=\\"Bearer %s\\"; \\"Content-Type\\"=\\"application/json\\" }; $b=\'%s\'; (Invoke-RestMethod -Method Post -Uri $u -Headers $h -Body $b | ConvertTo-Json -Depth 10 -Compress)"',
        token,
        body:gsub("'", "''")
    )

    local p = io.popen('cmd /c ' .. ps .. ' 2>nul', 'r')
    if not p then
        return nil, "failed to start PowerShell"
    end
    local out = p:read("*a")
    p:close()
    out = trim(out)
    if out == "" then
        return nil, "empty response"
    end
    return out, nil
end

function GetDotaStatsStratz(steamAccountId)
    local sid = tonumber(steamAccountId)
    if not sid then
        return "{\"success\":false,\"error\":\"invalid steamAccountId\"}"
    end

    local out, err = stratz_graphql(sid)
    if not out then
        return string.format('{"success":false,"error":"%s"}', json_escape(err or "unknown error"))
    end
    return out
end

-- Called from frontend to confirm that webkit/index.js executed.
function FrontendPing()
    logger:info("[dotastats] FrontendPing received")
    return "ok"
end

-- Generic logging endpoint for frontend diagnostics
function BackendLog(message)
    local msg = tostring(message)
    logger:info("[dotastats] frontend: " .. msg)
    
    -- Check if this is a URL opening request
    if msg:match("^Opening OpenDota:") or msg:match("^Opening Dotabuff:") then
        local url = msg:match("https://[%w%.%-_/]+")
        if url then
            logger:info("[dotastats] Attempting to open URL in Steam: " .. url)
            -- Try to open URL using Steam's internal browser
            local is_windows = package.config:sub(1, 1) == "\\"
            if is_windows then
                -- Use Steam protocol to open in Steam overlay browser
                os.execute('start "" "steam://openurl/' .. url .. '"')
            else
                os.execute('xdg-open "steam://openurl/' .. url .. '"')
            end
        end
    end
    
    return "ok"
end

-- Called from webkit bundle to confirm it actually executed
function WebkitPing()
    logger:info("[dotastats] WebkitPing received")
    return "ok"
end

return {
    on_load = on_load,
    on_frontend_loaded = on_frontend_loaded,
    on_unload = on_unload,
    FrontendPing = FrontendPing,
    BackendLog = BackendLog,
    WebkitPing = WebkitPing,
    GetDotaStatsStratz = GetDotaStatsStratz
}
