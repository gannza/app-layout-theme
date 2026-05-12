import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { VerifyMeResponse } from './types';

export interface AuthState {
  user: VerifyMeResponse | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'ssoAuth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<VerifyMeResponse>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;

export type AuthRootState = { ssoAuth: AuthState };

export const selectAuthUser = (state: AuthRootState) => state.ssoAuth.user;
export const selectIsAuthenticated = (state: AuthRootState) => state.ssoAuth.isAuthenticated;
