export interface HeroStat {
  heroId: number;
  shortName: string;
  displayName: string;
  matchCount: number;
  winCount: number;
  dotaPlusLevel: number | null;
}

export interface TeammateStat {
  steamAccountId: number;
  name: string;
  avatar: string | null;
  matchCount: number;
  winCount: number;
  isPrivate: boolean;
}

export interface DotaStats {
  matches: number;
  mmr: number | null;
  winrate: string;
  rank: number;
  stars: number;
  leaderboardRank: number | null;
  personaName: string | null;
  plusSubscriber: boolean;
  isPrivate: boolean;
  firstMatchDate: string | null;
  topHeroes: HeroStat[];
  heroMap: Record<number, { shortName: string; displayName: string }>;
  dotaPlusMap: Record<number, number>;
  activityCount: number;
  mainRole: number | null;
  topTeammates: TeammateStat[];
}

export interface OpenDotaStats {
  matches: number;
  winrate: string;
  rank: number;
  mmr: number | null;
  firstMatchDate: string | null;
  personaName: string | null;
}
