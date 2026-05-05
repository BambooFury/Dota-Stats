import { injectStyles } from "./styles";
import { updateWidget } from "./update";
import { getSteamId32 } from "./utils";

export default async function WebkitMain() {
  const steamId32 = await getSteamId32();
  if (!steamId32) return;

  const containerId = `dotastats-container-${steamId32}`;
  if (document.getElementById(containerId)) return;

  let anchor: NodeListOf<Element> | null = null;
  for (let i = 0; i < 3; i++) {
    anchor = await Millennium.findElement(document, ".profile_rightcol", 8000).catch(() => null);
    if (anchor && anchor[0]) break;
    await new Promise(r => setTimeout(r, 1000));
  }
  if (!anchor || !anchor[0]) return;

  if (document.getElementById(containerId)) return;

  injectStyles();

  const container = document.createElement("div");
  container.id = containerId;
  anchor[0].prepend(container);

  updateWidget(container, steamId32);
}
