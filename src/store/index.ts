// src/store/index.ts
import { primaryTournament } from '../pages/data/mockTournaments';
import type { Tournament } from '../types';

export function useTournament(): Tournament {
  // In future you can replace this with Zustand/Redux/etc.
  return primaryTournament;
}
