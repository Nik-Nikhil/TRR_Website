import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/authSlice";
import tournamentReducer from "../store/tournamentSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tournament: tournamentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;