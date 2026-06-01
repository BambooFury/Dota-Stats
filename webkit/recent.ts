import { ICONS } from "./icons";
import { renderTemplate, TEMPLATES } from "./template";

export function buildRecentMatchesHtml(matches: { win: boolean; heroShortName: string }[], steamId?: string): string {
  if (!matches.length) return "";

  const badges = matches.map(m => {
    const resultClass = m.win ? "win" : "loss";
    const heroImg = m.heroShortName
      ? renderTemplate(TEMPLATES.recentHeroImg, {
        heroImgUrl: `https://cdn.stratz.com/images/dota2/heroes/${m.heroShortName}_horz.png`,
      })
      : "";
    const letterHtml = m.win ? "W" : ICONS.lossLetter;

    return renderTemplate(TEMPLATES.recentBadge, {
      resultClass,
      heroImg,
      letterHtml,
    });
  }).join("");

  return renderTemplate(TEMPLATES.recentMatches, {
    id: steamId ? `dotastats-recent-${steamId}` : "",
    badges,
  });
}
