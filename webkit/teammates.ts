import type { TeammateStat } from "./types";

export function buildTeammatesHtml(teammates: TeammateStat[]): string {
  if (!teammates.length) return "";

  const rows = teammates.map(t => {
    const wr = t.matchCount > 0 ? (t.winCount / t.matchCount * 100).toFixed(1) : "0.0";
    const wrColor = parseFloat(wr) >= 50 ? "#4caf50" : "#e74c3c";
    const avatarUrl = t.avatar
      ? t.avatar.replace("_full.jpg", "_medium.jpg")
      : `https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg`;
    const steamId64 = (BigInt(t.steamAccountId) + BigInt("76561197960265728")).toString();
    const profileUrl = `https://steamcommunity.com/profiles/${steamId64}`;
    const privateBadgeInline = t.isPrivate
      ? `<svg fill="#6a7a8a" height="13" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0;vertical-align:middle;margin-left:3px;"><path d="M12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12zm.017-16.5c-11.065 0-8.94 9-3.962 9 .998 0 1.937-.485 2.536-1.31l.643-.885a.96.96 0 0 1 1.566 0l.643.886a3.136 3.136 0 0 0 2.535 1.309c4.747 0 7.266-9-3.961-9zM8.6 13.227c-1.026 0-1.694-.601-2.002-.962a.408.408 0 0 1 0-.53c.308-.361.975-.962 2.002-.962 1.027 0 1.694.601 2.002.962.13.153.13.377 0 .53-.308.361-.976.962-2.002.962zm6.8 0c-1.027 0-1.694-.601-2.002-.962a.408.408 0 0 1 0-.53c.308-.361.975-.962 2.002-.962 1.027 0 1.694.601 2.002.962.13.153.13.377 0 .53-.308.361-.976.962-2.002.962z"/></svg>`
      : "";
    return `
      <div class="dotastats-hero-row">
        <span class="dotastats-hero-dot">&#8226;</span>
        <a href="${profileUrl}" style="display:flex;align-items:center;flex-shrink:0;cursor:pointer"><img src="${avatarUrl}" style="width:22px;height:22px;border-radius:3px;object-fit:cover;" alt="${t.name}" /></a>
        <div style="flex:1;display:flex;align-items:center;gap:3px;overflow:hidden;min-width:0;">
          <a href="${profileUrl}" style="color:#c6d4df;text-decoration:none;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#c6d4df'">${t.name}</a>${privateBadgeInline ? `<span style="flex-shrink:0">${privateBadgeInline}</span>` : ""}
        </div>
        <div class="dotastats-hero-stats">
          <span style="color:${wrColor}">${wr}%</span>
          <span style="font-size:10px">${t.matchCount} game</span>
        </div>
      </div>
    `;
  }).join("");

  return `
    <div style="margin-top:6px">
      <div class="dotastats-heroes-title" style="margin-bottom:5px">Teammates</div>
      ${rows}
    </div>
  `;
}
