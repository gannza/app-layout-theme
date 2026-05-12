import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './authSlice';
import { createSsoAuthApi } from './authApi';
import type { SigningConfig } from './types';

export function createAuthStore(
  ssoBaseUrl: string,
  signingConfig: SigningConfig | null,
  encryptionEnabled: boolean,
) {
  const api = createSsoAuthApi(
    ssoBaseUrl,
    signingConfig,
    encryptionEnabled,
  );

  const store = configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      [authSlice.name]: authSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });

  return { store, api };
}

export type AuthStore = ReturnType<typeof createAuthStore>['store'];
