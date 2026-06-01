import { DOTABUFF_ICON } from "./constants";
import { renderTemplate, TEMPLATES } from "./template";
import type { HeroStat } from "./types";

export function buildHeroesHtml(heroes: HeroStat[], steamId: string): string {
  if (!heroes.length) return "";

  const rows = heroes.map(h => {
    const wr = h.matchCount > 0 ? (h.winCount / h.matchCount * 100).toFixed(1) : "0.0";
    const badgeLevel = h.dotaPlusLevel ? (
      h.dotaPlusLevel >= 30 ? 6 :
      h.dotaPlusLevel >= 25 ? 5 :
      h.dotaPlusLevel >= 18 ? 4 :
      h.dotaPlusLevel >= 12 ? 3 :
      h.dotaPlusLevel >= 6  ? 2 : 1
    ) : null;
    const badgeHtml = badgeLevel
      ? renderTemplate(TEMPLATES.heroBadge, {
        badgeUrl: `https://cdn.stratz.com/images/dota2/plus/hero_badge_${badgeLevel}.png`,
      })
      : "";

    return renderTemplate(TEMPLATES.heroRow, {
      imgUrl: `https://cdn.stratz.com/images/dota2/heroes/${h.shortName}_horz.png`,
      displayName: h.displayName,
      badgeHtml,
      matchCount: h.matchCount,
      wr,
      wrClass: parseFloat(wr) >= 50 ? "" : "dotastats-hero-wr--loss",
    });
  }).join("");

  return renderTemplate(TEMPLATES.heroes, {
    steamId,
    dotabuffIcon: DOTABUFF_ICON,
    rows,
  });
}
