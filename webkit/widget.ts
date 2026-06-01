import {
  DOTABUFF_ICON,
  DOTA_PLUS_ICON,
  RANK_NAMES,
} from "./constants";
import { ICONS } from "./icons";
import { renderTemplate, TEMPLATES } from "./template";
import { getRankImageUrl } from "./utils";
import type { DotaStats, OpenDotaStats } from "./types";

function rankLabelClass(tier: number): string {
  return tier >= 0 && tier <= 8 ? `dotastats-rank-label--tier-${tier}` : "";
}

function privateBadgeHtml(): string {
  return renderTemplate(TEMPLATES.privateBadge, { privateIcon: ICONS.privateProfile });
}

function nameHtml(personaName: string, plusSubscriber = false): string {
  return renderTemplate(TEMPLATES.name, {
    personaName,
    plusHtml: plusSubscriber
      ? renderTemplate(TEMPLATES.plusBadge, { dotaPlusIcon: DOTA_PLUS_ICON })
      : "",
  });
}

export function buildFallbackWidgetHtml(stats: OpenDotaStats): string {
  const tier = Math.floor(stats.rank / 10);
  const rankName = RANK_NAMES[tier] ?? "Unranked";
  const star = stats.rank % 10;
  const rankLabel = tier === 0
    ? "Unranked"
    : tier === 8 ? "Immortal"
    : `${rankName} ${star}`;
  const mmrText = stats.mmr !== null ? `~${stats.mmr} MMR` : "Immortal";

  return renderTemplate(TEMPLATES.fallbackWidget, {
    rankImgUrl: getRankImageUrl(stats.rank),
    rankName,
    nameHtml: stats.personaName ? nameHtml(stats.personaName) : "",
    rankLabelClass: rankLabelClass(tier),
    rankLabel,
    matches: stats.matches,
    winrate: `${stats.winrate}%`,
    mmrText,
  });
}

export function buildWidgetHtml(stats: DotaStats, steamId: string): string {
  const tier = Math.floor(stats.rank / 10);
  const rankName = RANK_NAMES[tier] ?? "Unranked";
  const rankImgUrl = getRankImageUrl(stats.rank);

  const rankLabel = tier === 0
    ? "Unranked"
    : tier === 8
      ? stats.leaderboardRank ? `Immortal \u2014 #${stats.leaderboardRank}` : "Immortal"
      : `${rankName} ${stats.stars}`;

  const mmrText = tier === 8
    ? stats.leaderboardRank ? `#${stats.leaderboardRank} Leaderboard` : "Immortal"
    : stats.mmr !== null ? `~${stats.mmr} MMR` : "Unranked";

  const privateBadge = privateBadgeHtml();
  const profileNameHtml = stats.isPrivate
    ? privateBadge
    : stats.personaName
      ? nameHtml(stats.personaName, stats.plusSubscriber)
      : privateBadge;

  const heroesHtml = stats.isPrivate
    ? ""
    : renderTemplate(TEMPLATES.heroes, {
      steamId,
      dotabuffIcon: DOTABUFF_ICON,
      rows: [0, 1, 2].map(() => TEMPLATES.heroSkeletonRow).join(""),
    });

  const showMore = !(tier === 0 && stats.matches === 0) && !stats.isPrivate;
  const expandHtml = showMore
    ? renderTemplate(TEMPLATES.expand, {
      steamId,
      chevronIcon: ICONS.chevronDown,
      activityHtml: renderTemplate(TEMPLATES.activityLoading, { steamId }),
    })
    : "";

  return renderTemplate(TEMPLATES.widget, {
    heroesHtml,
    expandHtml,
    privateBadgeHtml: stats.isPrivate ? privateBadge : "",
    rankImgUrl,
    rankName,
    nameHtml: stats.isPrivate ? "" : profileNameHtml,
    rankLabelClass: rankLabelClass(tier),
    rankLabel,
    matches: stats.matches,
    winrate: `${stats.winrate}%`,
    mmrText,
    footerHtml: stats.firstMatchDate
      ? renderTemplate(TEMPLATES.footer, { sinceText: `Since ${stats.firstMatchDate}` })
      : "",
  });
}
