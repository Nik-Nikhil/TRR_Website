// src/data/mockTournaments.ts
import type { Tournament, Team, Match } from '../types';

const teams: Team[] = [
  { id: '1', name: 'Ancient Guardians', shortName: 'AG', region: 'EU' },
  { id: '2', name: 'Shadow Roshan', shortName: 'SR', region: 'SEA' },
  { id: '3', name: 'Divine Echoes', shortName: 'DE', region: 'CN' },
  { id: '4', name: 'Cave Raiders', shortName: 'CR', region: 'NA' },
  { id: '5', name: 'Golem Smashers', shortName: 'GS', region: 'SA' },
  { id: '6', name: 'Rush Rumble', shortName: 'RR', region: 'EU' },
];

const findTeam = (shortName: string) =>
  teams.find(t => t.shortName === shortName)!;

const matches: Match[] = [
  {
    id: 'm1',
    round: 'Group Stage - Day 1',
    stage: 'groups',
    scheduledAt: '2025-06-12T10:00:00Z',
    bestOf: 2,
    teamA: findTeam('AG'),
    teamB: findTeam('SR'),
    streamUrl: 'https://twitch.tv/roshanrumble',
  },
  {
    id: 'm2',
    round: 'Group Stage - Day 1',
    stage: 'groups',
    scheduledAt: '2025-06-12T13:00:00Z',
    bestOf: 2,
    teamA: findTeam('DE'),
    teamB: findTeam('CR'),
  },
  {
    id: 'm3',
    round: 'Upper Bracket R1',
    stage: 'playoffs',
    scheduledAt: '2025-06-15T11:00:00Z',
    bestOf: 3,
    teamA: findTeam('AG'),
    teamB: findTeam('DE'),
  },
  {
    id: 'm4',
    round: 'Upper Bracket R1',
    stage: 'playoffs',
    scheduledAt: '2025-06-15T15:00:00Z',
    bestOf: 3,
    teamA: findTeam('SR'),
    teamB: findTeam('CR'),
  },
  {
    id: 'm5',
    round: 'Lower Bracket Final',
    stage: 'playoffs',
    scheduledAt: '2025-06-18T14:00:00Z',
    bestOf: 3,
    teamA: findTeam('GS'),
    teamB: findTeam('RR'),
  },
  {
    id: 'm6',
    round: 'Grand Final',
    stage: 'finals',
    scheduledAt: '2025-06-20T16:00:00Z',
    bestOf: 5,
    teamA: findTeam('AG'),
    teamB: findTeam('SR'),
    streamUrl: 'https://twitch.tv/roshanrumble',
  },
];

export const primaryTournament: Tournament = {
  id: 'trr-2025',
  name: 'The Roshan Rumble',
  shortName: 'TRR',
  year: 2025,
  prizePool: 40000,
  location: 'India ',
  startDate: '2025-06-12',
  endDate: '2025-06-20',
  tagline: 'Only one team escapes the pit.',
  description:
    'The Roshan Rumble brings the fiercest Dota 2 teams into the depths of the pit. High stakes, clutch buybacks, and Aegis snatches await.',
  matches,
};

export const tournaments: Tournament[] = [primaryTournament];
