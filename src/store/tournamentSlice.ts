import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "../../src/store/store";
import { primaryTournament } from "../../src/data/mockTournaments";


export type Tournament = typeof primaryTournament;

interface TournamentState {
  current: Tournament;
  loading: boolean;
  error: string | null;
}

const initialState: TournamentState = {
  current: primaryTournament,
  loading: false,
  error: null,
};

const tournamentSlice = createSlice({
  name: "tournament",
  initialState,
  reducers: {
    setCurrentTournament: (state, action: PayloadAction<Tournament>) => {
      state.current = action.payload;
      state.error = null;
    },
    setTournamentLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setTournamentError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setCurrentTournament, setTournamentLoading, setTournamentError } = tournamentSlice.actions;
export default tournamentSlice.reducer;

// Placeholder thunk for when this stops being mock data and starts being a
// real API call. For now it just re-seeds from the mock so every component
// goes through the same dispatch path from day one.
export const fetchCurrentTournament = () => async (dispatch: AppDispatch) => {
  dispatch(setTournamentLoading(true));
  try {
    // Swap this for: const res = await fetch("/api/tournaments/current"); const data = await res.json();
    dispatch(setCurrentTournament(primaryTournament));
  } catch {
    dispatch(setTournamentError("Failed to load tournament data"));
  } finally {
    dispatch(setTournamentLoading(false));
  }
};