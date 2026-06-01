import { constSysfsExpr } from "@steambrew/webkit";

export const ICONS = {
  chevronDown: constSysfsExpr("chevron-down.svg", { basePath: "./icons", encoding: "utf8" }).content,
  lossLetter: constSysfsExpr("loss-letter.svg", { basePath: "./icons", encoding: "utf8" }).content,
  privateProfile: constSysfsExpr("private-profile.svg", { basePath: "./icons", encoding: "utf8" }).content,
  roleCarry: constSysfsExpr("role-carry.svg", { basePath: "./icons", encoding: "utf8" }).content,
  roleMid: constSysfsExpr("role-mid.svg", { basePath: "./icons", encoding: "utf8" }).content,
  roleOfflane: constSysfsExpr("role-offlane.svg", { basePath: "./icons", encoding: "utf8" }).content,
  roleSoftSupport: constSysfsExpr("role-soft-support.svg", { basePath: "./icons", encoding: "utf8" }).content,
  roleHardSupport: constSysfsExpr("role-hard-support.svg", { basePath: "./icons", encoding: "utf8" }).content,
} as const;
