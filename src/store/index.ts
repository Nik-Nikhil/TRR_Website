// src/store/index.ts
import { primaryTournament } from '../data/mockTournaments';
import type { Tournament } from '../types';

export function useTournament(): Tournament {
  // In future you can replace this with Zustand/Redux/etc.
  return primaryTournament;
}
