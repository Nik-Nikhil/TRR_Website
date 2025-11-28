// src/types/index.ts
export type Team = {
  id: string;
  name: string;
  shortName: string;
  region: string;
  logoUrl?: string;
  seed?: number;
};

export type Match = {
  id: string;
  round: string;              // e.g. "Upper Bracket R1"
  stage: 'groups' | 'playoffs' | 'finals';
  scheduledAt: string;        // ISO date string
  bestOf: number;
  streamUrl?: string;
  teamA: Team;
  teamB: Team;
};

export type Tournament = {
  id: string;
  name: string;
  shortName: string;
  year: number;
  prizePool: number;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  tagline: string;
  matches: Match[];
};
