local logger = require("logger")
local millennium = require("millennium")

local function trim(s)
    return (tostring(s):gsub("^%s+", ""):gsub("%s+$", ""))
end

local function normalize_path(p)
    -- debug.getinfo() returns Windows paths with single backslashes
    -- so we normalize both single and double backslashes to forward slashes
    p = p:gsub("\\\\", "/")
    p = p:gsub("\\", "/")
    return p
end

local function dirname(p)
    p = normalize_path(p)
    return (p:match("^(.*)/[^/]*$") or ".")
end

local function join_path(a, b)
    a = normalize_path(a)
    b = normalize_path(b)
    if a:sub(-1) == "/" then
        return a .. b
    end
    return a .. "/" .. b
end

local function get_plugin_dir()
    local src = debug.getinfo(1, "S").source or ""
    src = src:gsub("^@", "")
    local backend_dir = dirname(src)
    return dirname(backend_dir)
end

local function is_windows()
    return package.config:sub(1, 1) == "\\"
end

local function ensure_dir(path)
    if is_windows() then
        os.execute('mkdir "' .. path .. '" 2>nul')
    else
        os.execute('mkdir -p "' .. path .. '"')
    end
end

local function file_exists(path)
    local f = io.open(path, "rb")
    if f then
        f:close()
        return true
    end
    return false
end

local function copy_rank_icons()
    local plugin_dir = get_plugin_dir()

    local ranks_dir = join_path(plugin_dir, "backend/static/ranks")
    local steam_path = millennium.steam_path()
    local dest_dir = join_path(steam_path, "steamui/DotaRanks")

    logger:info("[dotastats] plugin_dir: " .. plugin_dir)
    logger:info("[dotastats] ranks_dir: " .. ranks_dir)
    logger:info("[dotastats] dest_dir: " .. dest_dir)

    ensure_dir(dest_dir)

    -- Don't copy on every startup: it causes console windows to flash.
    -- If at least one expected file exists, assume icons are already installed.
    local sentinel = join_path(dest_dir, "rank_icon_1_1.png")
    if file_exists(sentinel) then
        logger:info("[dotastats] rank icons already present, skipping copy")
        return
    end

    -- IMPORTANT: do a single copy command to avoid spawning many console windows
    if is_windows() then
        -- /D copies only newer files, /Y suppresses prompts, /I assumes destination is a directory
        local cmd = 'cmd /c xcopy /D /Y /I "' .. ranks_dir .. '\\*.png" "' .. dest_dir .. '\\" >nul 2>nul'
        os.execute(cmd)
        logger:info("[dotastats] copied rank icons via xcopy")
    else
        os.execute('cp -f "' .. ranks_dir .. '"/*.png "' .. dest_dir .. '" 2>/dev/null')
        logger:info("[dotastats] copied rank icons via cp")
    end
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
    local token_path = join_path(get_plugin_dir(), "backend/stratz_token.txt")
    local f = io.open(token_path, "rb")
    if not f then
        return nil, "stratz_token.txt not found"
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

    if not is_windows() then
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
