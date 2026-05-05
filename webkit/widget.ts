import {
  DOTABUFF_ICON,
  DOTA_PLUS_ICON,
  RANK_COLORS,
  RANK_GRADIENTS,
  RANK_NAMES,
} from "./constants";
import { getRankImageUrl } from "./utils";
import type { DotaStats, OpenDotaStats } from "./types";

export function buildFallbackWidgetHtml(stats: OpenDotaStats): string {
  const tier = Math.floor(stats.rank / 10);
  const rankName = RANK_NAMES[tier] ?? "Unranked";
  const rankColor = RANK_COLORS[tier] ?? "#c6d4df";
  const rankGradient = RANK_GRADIENTS[tier] ?? null;
  const rankImgUrl = getRankImageUrl(stats.rank);
  const star = stats.rank % 10;

  const rankLabel = tier === 0
    ? "Unranked"
    : tier === 8 ? "Immortal"
    : `${rankName} ${star}`;

  const mmrText = stats.mmr !== null ? `~${stats.mmr} MMR` : "Immortal";

  return `
    <div class="dotastats-widget">
      <div class="dotastats-main" style="display:flex!important;flex-direction:row!important;align-items:center!important;gap:10px!important;margin-top:0!important;">
        <img class="dotastats-rank-img" style="width:52px!important;height:52px!important;object-fit:contain!important;flex-shrink:0!important;" src="${rankImgUrl}" alt="${rankName}" />
        <div class="dotastats-info" style="flex:1!important;min-width:0!important;">
          ${stats.personaName ? `<div class="dotastats-name">${stats.personaName}</div>` : ""}
          <div class="dotastats-rank-label" style="${rankGradient ? `background:${rankGradient};-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;` : `color:${rankColor};`}">${rankLabel}</div>
          <div class="dotastats-stats-row">
            <span><span class="dotastats-stat-val">${stats.matches}</span> matches</span>
            <span><span class="dotastats-stat-val">${stats.winrate}%</span> WR</span>
            <span class="dotastats-stat-val">${mmrText}</span>
          </div>
        </div>
      </div>
      <div style="margin-top:7px;font-size:9px;color:#4a5568;text-align:center">⚠ Stats service is experiencing issues &nbsp;·&nbsp; via OpenDota</div>
    </div>
  `;
}

export function buildWidgetHtml(stats: DotaStats, steamId: string): string {
  const tier = Math.floor(stats.rank / 10);
  const rankName = RANK_NAMES[tier] ?? "Unranked";
  const rankColor = RANK_COLORS[tier] ?? "#c6d4df";
  const rankGradient = RANK_GRADIENTS[tier] ?? null;
  const rankImgUrl = getRankImageUrl(stats.rank);

  const rankLabel = tier === 0
    ? "Unranked"
    : tier === 8
      ? stats.leaderboardRank ? `Immortal \u2014 #${stats.leaderboardRank}` : "Immortal"
      : `${rankName} ${stats.stars}`;

  const mmrText = tier === 8
    ? stats.leaderboardRank ? `#${stats.leaderboardRank} Leaderboard` : "Immortal"
    : stats.mmr !== null ? `~${stats.mmr} MMR` : "Unranked";

  const privateBadge = `<div style="display:flex;align-items:center;justify-content:center;gap:5px;margin-bottom:6px;width:100%;">
    <svg fill="#6a7a8a" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12zm.017-16.5c-11.065 0-8.94 9-3.962 9 .998 0 1.937-.485 2.536-1.31l.643-.885a.96.96 0 0 1 1.566 0l.643.886a3.136 3.136 0 0 0 2.535 1.309c4.747 0 7.266-9-3.961-9zM8.6 13.227c-1.026 0-1.694-.601-2.002-.962a.408.408 0 0 1 0-.53c.308-.361.975-.962 2.002-.962 1.027 0 1.694.601 2.002.962.13.153.13.377 0 .53-.308.361-.976.962-2.002.962zm6.8 0c-1.027 0-1.694-.601-2.002-.962a.408.408 0 0 1 0-.53c.308-.361.975-.962 2.002-.962 1.027 0 1.694.601 2.002.962.13.153.13.377 0 .53-.308.361-.976.962-2.002.962z"/>
    </svg>
    <span style="color:#6a7a8a;font-size:11px;font-weight:500">Private Profile</span>
  </div>`;

  const nameHtml = stats.isPrivate
    ? privateBadge
    : stats.personaName
      ? `<div class="dotastats-name">${stats.personaName}${stats.plusSubscriber ? ` <span class="dotastats-plus"><img src="${DOTA_PLUS_ICON}" alt="Dota Plus" /></span>` : ""}</div>`
      : privateBadge;

  const heroesHtml = stats.isPrivate ? "" : `
    <div class="dotastats-heroes" id="dotastats-heroes-${steamId}">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
        <span class="dotastats-heroes-title" style="margin-bottom:0">Top Heroes</span>
        <a href="https://www.dotabuff.com/players/${steamId}" target="_blank" style="display:flex;align-items:center;opacity:0.8;transition:opacity 0.15s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.8'">
          <img src="${DOTABUFF_ICON}" style="width:16px;height:16px;object-fit:contain;" alt="Dotabuff" />
        </a>
      </div>
      ${[0,1,2].map(() => `
      <div class="dotastats-skel-row" style="margin-bottom:5px">
        <div class="dotastats-skel-block" style="width:8px;height:8px;border-radius:50%;flex-shrink:0"></div>
        <div class="dotastats-skel-block" style="width:40px;height:22px;border-radius:3px;flex-shrink:0"></div>
        <div class="dotastats-skel-block" style="width:80px;height:11px"></div>
        <div style="margin-left:auto;display:flex;gap:6px">
          <div class="dotastats-skel-block" style="width:32px;height:11px"></div>
          <div class="dotastats-skel-block" style="width:36px;height:11px"></div>
        </div>
      </div>`).join("")}
    </div>
  `;

  const activityHtml = `
    <div class="dotastats-activity" id="dotastats-activity-${steamId}">
      <div class="dotastats-hero-row">
        <span class="dotastats-hero-dot">&#8226;</span>
        <span class="dotastats-hero-name">Activity</span>
        <div class="dotastats-hero-stats" style="gap:6px">
          <div class="dotastats-skel-block" style="width:50px;height:10px;border-radius:3px"></div>
          <div class="dotastats-skel-block" style="width:60px;height:10px;border-radius:3px"></div>
        </div>
      </div>
    </div>
  `;

  const sinceText = stats.firstMatchDate ? `Since ${stats.firstMatchDate}` : "";
  const showMore = !(tier === 0 && stats.matches === 0) && !stats.isPrivate;

  return `
    <div class="dotastats-widget">
      ${heroesHtml}
      ${showMore ? `
      <div class="dotastats-expand-btn" id="dotastats-expand-btn-${steamId}" onclick="
        var p = document.getElementById('dotastats-expand-${steamId}');
        var arr = document.getElementById('dotastats-arrow-${steamId}');
        if(p.style.display==='none'){
          p.style.display='block';
          arr.style.transform='rotate(180deg)';
          if(window.__dotastats_load_more) window.__dotastats_load_more('${steamId}');
        } else {
          p.style.display='none';
          arr.style.transform='rotate(0deg)';
        }
      ">
        <span class="dotastats-expand-inner">
          <svg id="dotastats-arrow-${steamId}" class="dotastats-expand-arrow" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" style="transition:transform 0.2s">
            <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          More
        </span>
      </div>
      <div id="dotastats-expand-${steamId}" style="display:none">
        <div id="dotastats-recent-${steamId}" class="dotastats-recent-matches">
          <div class="dotastats-heroes-title" style="margin-bottom:5px">Recent Matches</div>
          <div class="dotastats-recent-row">
            ${[0,1,2,3,4].map(() => `<div class="dotastats-skel-block" style="width:36px;height:22px;border-radius:4px"></div>`).join("")}
          </div>
        </div>
        ${activityHtml}
        <div class="dotastats-hero-row" style="margin-top:2px">
          <span class="dotastats-hero-dot">&#8226;</span>
          <span class="dotastats-hero-name">Main Role</span>
          <div class="dotastats-hero-stats">
            <span id="dotastats-role-${steamId}" style="color:#c6d4df">&#8212;</span>
          </div>
        </div>
        <div id="dotastats-teammates-${steamId}">
          <div style="margin-top:6px">
            <div class="dotastats-heroes-title" style="margin-bottom:5px">Teammates</div>
            ${[0,1,2].map(() => `
            <div class="dotastats-skel-row" style="margin-bottom:5px">
              <div class="dotastats-skel-block" style="width:8px;height:8px;border-radius:50%;flex-shrink:0"></div>
              <div class="dotastats-skel-block" style="width:22px;height:22px;border-radius:3px;flex-shrink:0"></div>
              <div class="dotastats-skel-block" style="width:80px;height:11px"></div>
              <div style="margin-left:auto;display:flex;gap:6px">
                <div class="dotastats-skel-block" style="width:36px;height:11px"></div>
                <div class="dotastats-skel-block" style="width:28px;height:11px"></div>
              </div>
            </div>`).join("")}
          </div>
        </div>
      </div>` : ""}
      ${stats.isPrivate ? privateBadge : ""}
      <div class="dotastats-main" style="display:flex!important;flex-direction:row!important;align-items:center!important;gap:10px!important;margin-top:8px!important;">
        <img class="dotastats-rank-img" style="width:52px!important;height:52px!important;object-fit:contain!important;flex-shrink:0!important;" src="${rankImgUrl}" alt="${rankName}" />
        <div class="dotastats-info" style="flex:1!important;min-width:0!important;">
          ${stats.isPrivate ? "" : nameHtml}
          <div class="dotastats-rank-label" style="${rankGradient ? `background:${rankGradient};-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;` : `color:${rankColor};`}">${rankLabel}</div>
          <div class="dotastats-stats-row">
            <span><span class="dotastats-stat-val">${stats.matches}</span> matches</span>
            <span><span class="dotastats-stat-val">${stats.winrate}%</span> WR</span>
            <span class="dotastats-stat-val">${mmrText}</span>
          </div>
        </div>
      </div>
      ${sinceText ? `<div class="dotastats-footer"><span>${sinceText}</span></div>` : ""}
    </div>
  `;
}
