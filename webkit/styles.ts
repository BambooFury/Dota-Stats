import { constSysfsExpr } from "@steambrew/webkit";

const DOTASTATS_CSS = constSysfsExpr("./styles.css", { encoding: "utf8" }).content;

export function injectStyles() {
  if (document.getElementById("dotastats-style")) return;
  if (!document.getElementById("dotastats-font")) {
    const link = document.createElement("link");
    link.id = "dotastats-font";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap";
    document.head.appendChild(link);
  }
  const style = document.createElement("style");
  style.id = "dotastats-style";
  style.textContent = DOTASTATS_CSS;
  document.head.appendChild(style);
}
