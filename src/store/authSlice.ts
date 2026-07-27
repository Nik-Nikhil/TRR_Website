import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "./store";
import AuthService from "../services/auth";
import SteamAuthService from "../services/steamAuth";

export type AdminUser = {
  type: "admin";
  username: string;
  displayName?: string;
  role?: string;
};

export type PlayerUser = {
  type: "player";
  playerId?: string | number;
  nickname?: string;
  steamId?: string;
  avatarUrl?: string;
  loginMethod?: string;
};

export type CurrentUser = AdminUser | PlayerUser | null;

interface AuthState {
  currentUser: CurrentUser;
  isLoggedIn: boolean;
  isSuperAdmin: boolean;
  authChecked: boolean;
}

const initialState: AuthState = {
  currentUser: null,
  isLoggedIn: false,
  isSuperAdmin: false,
  authChecked: false,
};

type SetAuthPayload = Omit<AuthState, "authChecked">;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<SetAuthPayload>) => {
      state.currentUser = action.payload.currentUser;
      state.isLoggedIn = action.payload.isLoggedIn;
      state.isSuperAdmin = action.payload.isSuperAdmin;
      state.authChecked = true;
    },
    clearAuth: (state) => {
      state.currentUser = null;
      state.isLoggedIn = false;
      state.isSuperAdmin = false;
      state.authChecked = true;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;

type SuperAdminSession = { authenticated?: boolean; username?: string; role?: string };

function readSuperAdminSession(): SuperAdminSession | null {
  const raw = localStorage.getItem("superAdminSession");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to parse superAdminSession from localStorage", e);
    return null;
  }
}

// Thunk: this is a straight port of the old checkAuth() from Navbar.
// Call it on app mount and on route change (see Navbar.tsx).
export const checkAuthStatus = () => (dispatch: AppDispatch) => {
  const adminSession = AuthService.getCurrentAdminSession();
  const superAdminSession = readSuperAdminSession();

  const isSuperAdmin = !!(
    (adminSession && (adminSession.username === "reyuk" || adminSession.username === "nikhil")) ||
    superAdminSession?.authenticated
  );

  if (superAdminSession?.authenticated) {
    dispatch(
      setAuth({
        currentUser: {
          type: "admin",
          username: superAdminSession.username ?? "",
          displayName:
            superAdminSession.username === "reyuk"
              ? "Reyuk"
              : superAdminSession.username === "nikhil"
              ? "N1KHIL"
              : superAdminSession.username,
          role: superAdminSession.role,
        },
        isLoggedIn: true,
        isSuperAdmin,
      })
    );
    return;
  }

  const steamSession = SteamAuthService.getSession();
  if (steamSession) {
    dispatch(
      setAuth({
        currentUser: {
          type: "player",
          playerId: steamSession.playerId,
          nickname: steamSession.nickname,
          steamId: steamSession.steamId,
          avatarUrl: steamSession.avatarUrl,
          loginMethod: "steam",
        },
        isLoggedIn: true,
        isSuperAdmin,
      })
    );
    return;
  }

  const user = AuthService.getCurrentUser();
  const loggedIn = AuthService.isSessionValid();
  dispatch(setAuth({ currentUser: user, isLoggedIn: loggedIn, isSuperAdmin }));
};

export const logoutUser = () => (dispatch: AppDispatch) => {
  AuthService.logout();
  SteamAuthService.clearSession();
  localStorage.removeItem("superAdminSession");
  dispatch(clearAuth());
};

// Small selector-style helpers, since the union type makes plain field access annoying
export function getDisplayName(user: CurrentUser): string | undefined {
  if (!user) return undefined;
  if (user.type === "player") return user.nickname;
  if (user.type === "admin") return user.username;
  return undefined;
}

export function getUserRole(user: CurrentUser): string | undefined {
  if (!user) return undefined;
  if (user.type === "admin") return user.role ?? "Admin";
  return user.type;
}