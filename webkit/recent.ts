export function buildRecentMatchesHtml(matches: { win: boolean; heroShortName: string }[], steamId?: string): string {
  if (!matches.length) return "";
  const badges = matches.map(m => {
    const cls = m.win ? "win" : "loss";
    const overlay = m.win ? `rgba(20,80,35,0.55)` : `rgba(80,20,20,0.55)`;
    const heroImg = m.heroShortName
      ? `<img src="https://cdn.stratz.com/images/dota2/heroes/${m.heroShortName}_horz.png" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" />`
      : "";
    const letterHtml = m.win
      ? `<span class="dotastats-wl-letter">W</span>`
      : `<span class="dotastats-wl-letter"><svg width="7" height="9" viewBox="0 0 7 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 1V8H6" stroke="#ff9090" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
    return `<div class="dotastats-wl-badge ${cls}">
      ${heroImg}
      <div style="position:absolute;inset:0;background:${overlay};"></div>
      ${letterHtml}
    </div>`;
  }).join("");

  return `
    <div class="dotastats-recent-matches" id="${steamId ? `dotastats-recent-${steamId}` : ''}">
      <div class="dotastats-heroes-title" style="margin-bottom:5px">Recent Matches</div>
      <div class="dotastats-recent-row">${badges}</div>
    </div>
  `;
}
