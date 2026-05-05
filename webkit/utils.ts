import { RANK_ICON_CDN, RANK_MMR_MAP } from "./constants";

export function getMmrFromRank(rank: number, stars: number): number | null {
  const tier = Math.floor(rank / 10);
  const star = rank % 10;
  if (tier === 8) return null;
  return RANK_MMR_MAP[tier]?.[star] ?? null;
}

export function getRankImageUrl(rank: number): string {
  const tier = Math.floor(rank / 10);
  const star = rank % 10;
  if (tier === 0) return `${RANK_ICON_CDN}/rank_icon_unranked.png`;
  if (tier === 8) return `${RANK_ICON_CDN}/rank_icon_8_${star > 0 ? star : 1}.png`;
  return `${RANK_ICON_CDN}/rank_icon_${tier}_${star}.png`;
}

export function getSteamIdFromUrl(url: string): string | null {
  const m = url.match(/\/profiles\/(\d+)/);
  return m ? m[1] : null;
}

export function steamId64ToSteamId32(id64: string): string {
  return (BigInt(id64) - BigInt("76561197960265728")).toString();
}

export async function getSteamId32(): Promise<string | null> {
  const urlId64 = getSteamIdFromUrl(window.location.href);
  if (urlId64) return steamId64ToSteamId32(urlId64);

  try {
    const res = await fetch(`${window.location.href}/?xml=1`);
    const xml = await res.text();
    const xmlDoc = new DOMParser().parseFromString(xml, "application/xml");
    const id64 = xmlDoc.querySelector("steamID64")?.textContent ?? null;
    if (id64) return steamId64ToSteamId32(id64);
  } catch {}

  return null;
}
