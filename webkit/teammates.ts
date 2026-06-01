import { ICONS } from "./icons";
import { renderTemplate, TEMPLATES } from "./template";
import type { TeammateStat } from "./types";

export function buildTeammatesHtml(teammates: TeammateStat[]): string {
  if (!teammates.length) return "";

  const rows = teammates.map(t => {
    const wr = t.matchCount > 0 ? (t.winCount / t.matchCount * 100).toFixed(1) : "0.0";
    const avatarUrl = t.avatar
      ? t.avatar.replace("_full.jpg", "_medium.jpg")
      : `https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg`;
    const steamId64 = (BigInt(t.steamAccountId) + BigInt("76561197960265728")).toString();
    const profileUrl = `https://steamcommunity.com/profiles/${steamId64}`;
    const privateBadgeInline = t.isPrivate
      ? renderTemplate(TEMPLATES.privateInline, { privateIcon: ICONS.privateProfile })
      : "";

    return renderTemplate(TEMPLATES.teammateRow, {
      profileUrl,
      avatarUrl,
      name: t.name,
      privateBadgeInline,
      wrClass: parseFloat(wr) >= 50 ? "dotastats-hero-wr" : "dotastats-hero-wr--loss",
      wr,
      matchCount: t.matchCount,
    });
  }).join("");

  return renderTemplate(TEMPLATES.teammates, { rows });
}
