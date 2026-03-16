local logger = require("logger")
local millennium = require("millennium")

local function on_load()
    logger:info("[dotastats] loading, Millennium " .. millennium.version())
    millennium.ready()
end

local function on_frontend_loaded()
    logger:info("[dotastats] frontend loaded")
end

local function on_unload()
    logger:info("[dotastats] unloading")
end

return {
    on_load = on_load,
    on_frontend_loaded = on_frontend_loaded,
    on_unload = on_unload,
}
