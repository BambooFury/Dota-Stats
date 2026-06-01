import { constSysfsExpr } from "@steambrew/webkit";

export const TEMPLATES = {
  activity: constSysfsExpr("activity.html", { basePath: "./templates", encoding: "utf8" }).content,
  activityLoading: constSysfsExpr("activity-loading.html", { basePath: "./templates", encoding: "utf8" }).content,
  errorWidget: constSysfsExpr("error-widget.html", { basePath: "./templates", encoding: "utf8" }).content,
  expand: constSysfsExpr("expand.html", { basePath: "./templates", encoding: "utf8" }).content,
  fallbackWidget: constSysfsExpr("fallback-widget.html", { basePath: "./templates", encoding: "utf8" }).content,
  footer: constSysfsExpr("footer.html", { basePath: "./templates", encoding: "utf8" }).content,
  heroBadge: constSysfsExpr("hero-badge.html", { basePath: "./templates", encoding: "utf8" }).content,
  heroRow: constSysfsExpr("hero-row.html", { basePath: "./templates", encoding: "utf8" }).content,
  heroSkeletonRow: constSysfsExpr("hero-skeleton-row.html", { basePath: "./templates", encoding: "utf8" }).content,
  heroes: constSysfsExpr("heroes.html", { basePath: "./templates", encoding: "utf8" }).content,
  name: constSysfsExpr("name.html", { basePath: "./templates", encoding: "utf8" }).content,
  noData: constSysfsExpr("no-data.html", { basePath: "./templates", encoding: "utf8" }).content,
  plusBadge: constSysfsExpr("plus-badge.html", { basePath: "./templates", encoding: "utf8" }).content,
  privateBadge: constSysfsExpr("private-badge.html", { basePath: "./templates", encoding: "utf8" }).content,
  privateInline: constSysfsExpr("private-inline.html", { basePath: "./templates", encoding: "utf8" }).content,
  recentBadge: constSysfsExpr("recent-badge.html", { basePath: "./templates", encoding: "utf8" }).content,
  recentHeroImg: constSysfsExpr("recent-hero-img.html", { basePath: "./templates", encoding: "utf8" }).content,
  recentMatches: constSysfsExpr("recent-matches.html", { basePath: "./templates", encoding: "utf8" }).content,
  role: constSysfsExpr("role.html", { basePath: "./templates", encoding: "utf8" }).content,
  skeleton: constSysfsExpr("skeleton.html", { basePath: "./templates", encoding: "utf8" }).content,
  teammateRow: constSysfsExpr("teammate-row.html", { basePath: "./templates", encoding: "utf8" }).content,
  teammates: constSysfsExpr("teammates.html", { basePath: "./templates", encoding: "utf8" }).content,
  widget: constSysfsExpr("widget.html", { basePath: "./templates", encoding: "utf8" }).content,
} as const;

export function renderTemplate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(values[key] ?? ""));
}
