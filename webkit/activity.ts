import { renderTemplate, TEMPLATES } from "./template";

export function buildActivityFromDates(count6m: number, steamId?: string): string {
  let level: string;
  let levelClass: string;
  if (count6m === 0) {
    level = "Inactive"; levelClass = "dotastats-activity-level--inactive";
  } else if (count6m < 50) {
    level = "Low"; levelClass = "dotastats-activity-level--low";
  } else if (count6m < 200) {
    level = "Normal"; levelClass = "dotastats-activity-level--normal";
  } else if (count6m < 500) {
    level = "Hard"; levelClass = "dotastats-activity-level--hard";
  } else {
    level = "Very High"; levelClass = "dotastats-activity-level--very-high";
  }

  return renderTemplate(TEMPLATES.activity, {
    id: steamId ? `dotastats-activity-${steamId}` : "",
    level,
    levelClass,
    countText: `${count6m} game / ${new Date().getFullYear()}`,
  });
}
