import os
import shutil
import Millennium  # type: ignore
import PluginUtils  # type: ignore

LOGGER = PluginUtils.Logger()


def get_plugin_dir() -> str:
    """Возвращает корневую папку плагина dotastats.

    __file__ -> .../dotastats/backend/main.py
    dirname(__file__) -> .../dotastats/backend
    dirname(dirname(__file__)) -> .../dotastats
    """

    plugin_dir = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
    return os.path.abspath(plugin_dir)


def copy_rank_icons() -> None:
    plugin_dir = get_plugin_dir()
    static_ranks = os.path.join(plugin_dir, "static", "ranks")
    if not os.path.isdir(static_ranks):
        LOGGER.log(f"[dotastats] ranks folder not found: {static_ranks}")
        return

    steamui_dest = os.path.join(Millennium.steam_path(), "steamui", "DotaRanks")
    os.makedirs(steamui_dest, exist_ok=True)

    for name in os.listdir(static_ranks):
        if not name.lower().endswith(".png"):
            continue
        src = os.path.join(static_ranks, name)
        dst = os.path.join(steamui_dest, name)
        try:
            shutil.copy(src, dst)
            LOGGER.log(f"[dotastats] copied {src} -> {dst}")
        except Exception as e:  # noqa: BLE001
            LOGGER.log(f"[dotastats] failed to copy {src}: {e}")


class Plugin:
    def _front_end_loaded(self):
        LOGGER.log("[dotastats] front end loaded")

    def _load(self):
        LOGGER.log(f"[dotastats] loading, Millennium {Millennium.version()}")
        copy_rank_icons()
        Millennium.ready()

    def _unload(self):
        LOGGER.log("[dotastats] unloading")
