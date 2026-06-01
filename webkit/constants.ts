export const STRATZ_API = "https://calm-rat-32.bamboofury.deno.net";

export const RANK_ICON_CDN = "https://cdn.jsdelivr.net/gh/BambooFury/Dota-Stats@main/static";
export const DOTA_PLUS_ICON = "https://cdn.jsdelivr.net/gh/BambooFury/Dota-Stats@main/static/dota_plus.png";
export const DOTABUFF_ICON = "https://cdn.jsdelivr.net/gh/BambooFury/Dota-Stats@main/static/dotabuff_icon.png";

export const RANK_MMR_MAP: Record<number, Record<number, number>> = {
  1: { 1: 0, 2: 154, 3: 308, 4: 462, 5: 616 },
  2: { 1: 770, 2: 924, 3: 1078, 4: 1232, 5: 1386 },
  3: { 1: 1540, 2: 1694, 3: 1848, 4: 2002, 5: 2156 },
  4: { 1: 2310, 2: 2464, 3: 2618, 4: 2772, 5: 2926 },
  5: { 1: 3080, 2: 3234, 3: 3388, 4: 3542, 5: 3696 },
  6: { 1: 3850, 2: 4004, 3: 4158, 4: 4312, 5: 4466 },
  7: { 1: 4620, 2: 4820, 3: 5020, 4: 5220, 5: 5420 },
  8: { 1: 6200, 2: 6400, 3: 6600, 4: 6800, 5: 7000 },
};

export const RANK_NAMES: Record<number, string> = {
  1: "Herald", 2: "Guardian", 3: "Crusader", 4: "Archon",
  5: "Legend", 6: "Ancient", 7: "Divine", 8: "Immortal",
};
