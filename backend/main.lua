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
    local plugin_dir = get_plugin_dir()
    local ranks_dir = fs.join(plugin_dir, "backend", "static", "ranks")
    local steam_path = millennium.steam_path()
    local dest_dir = fs.join(steam_path, "steamui", "DotaRanks")

    logger:info("[dotastats] plugin_dir: " .. plugin_dir)
    logger:info("[dotastats] ranks_dir: " .. ranks_dir)
    logger:info("[dotastats] dest_dir: " .. dest_dir)

    -- Create destination directory if it doesn't exist
    if not fs.exists(dest_dir) then
        local ok, err = fs.create_directories(dest_dir)
        if not ok then
            logger:error("[dotastats] failed to create dest_dir: " .. tostring(err))
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
        logger:error("[dotastats] ranks_dir does not exist: " .. ranks_dir)
        return
    end

    local entries = fs.list(ranks_dir)
    if not entries then
        logger:error("[dotastats] failed to list ranks_dir")
        return
    end

    for _, entry in ipairs(entries) do
        -- entry might be just a string (filename) or a table with fields
        local filename = type(entry) == "string" and entry or entry.name or entry.path
        if filename and fs.extension(filename) == ".png" then
            local src = fs.join(ranks_dir, filename)
            local dst = fs.join(dest_dir, filename)
            
            -- Only copy if source is actually a file
            if fs.is_file(src) then
                local ok, err = fs.copy(src, dst)
                if not ok then
                    logger:error("[dotastats] failed to copy " .. filename .. ": " .. tostring(err))
                end
            end
        end
    end

    logger:info("[dotastats] copied rank icons using fs module")
end

local function on_load()
    logger:info("[dotastats] loading, Millennium " .. millennium.version())
    copy_rank_icons()
    millennium.ready()
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
    logger:info("[dotastats] frontend: " .. tostring(message))
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
