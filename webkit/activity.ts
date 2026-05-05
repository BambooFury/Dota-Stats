export function buildActivityFromDates(count6m: number, steamId?: string): string {
  let level: string;
  let color: string;
  if (count6m === 0) {
    level = "Inactive"; color = "#4a5568";
  } else if (count6m < 50) {
    level = "Low"; color = "#718096";
  } else if (count6m < 200) {
    level = "Normal"; color = "#4caf50";
  } else if (count6m < 500) {
    level = "Hard"; color = "#e67e22";
  } else {
    level = "Very High"; color = "#e74c3c";
  }

  const countText = `${count6m} game / ${new Date().getFullYear()}`;
  return `
    <div class="dotastats-activity" id="${steamId ? `dotastats-activity-${steamId}` : ''}">
      <div class="dotastats-hero-row">
        <span class="dotastats-hero-dot">&#8226;</span>
        <span class="dotastats-hero-name">Activity</span>
        <div class="dotastats-hero-stats">
          <span style="color:${color};font-weight:600">${level}</span>
          <span>${countText}</span>
        </div>
      </div>
    </div>
  `;
}
