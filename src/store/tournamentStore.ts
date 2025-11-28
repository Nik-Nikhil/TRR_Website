import { create } from 'zustand';

interface Match {
  id: number;
  team1: { name: string; logo: string };
  team2: { name: string; logo: string };
  score?: [number, number];
  status: 'upcoming' | 'live' | 'completed';
  date: string;
  round: string;
}

interface TournamentState {
  matches: Match[];
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const useTournamentStore = create<TournamentState>((set) => ({
  matches: [],
  darkMode: true,
  toggleDarkMode: () => set((state) => ({ 
    darkMode: !state.darkMode 
  })),
}));