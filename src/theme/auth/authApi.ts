import { createApi } from '@reduxjs/toolkit/query/react';
import type { VerifyMeResponse, SigningConfig } from './types';
import { createAuthBaseQuery } from './authBaseQuery';

/** Shape returned by the SSO server — user data is nested under `me` */
interface VerifyMeApiResponse {
  isAuthenticated: boolean;
  me: VerifyMeResponse;
}

/**
 * Factory — call once per AppShell instance so each instance gets its own
 * store with the correct ssoBaseUrl baked into the base query.
 */
export function createSsoAuthApi(
  ssoBaseUrl: string,
  signingConfig: SigningConfig | null,
  encryptionEnabled: boolean,
) {
  return createApi({
    reducerPath: 'ssoAuthApi',
    baseQuery: createAuthBaseQuery(
      ssoBaseUrl,
      signingConfig,
      encryptionEnabled,
    ),
    tagTypes: ['Auth'],
    endpoints: (builder) => ({
      /** GET /api/auth/verify-me — returns current user + entity sectors */
      verifyMe: builder.query<VerifyMeResponse, void>({
        query: () => ({ url: 'auth/verify-me' }),
        providesTags: ['Auth'],
        transformResponse: (response: VerifyMeApiResponse) => response.me,
      }),

      /** POST /api/auth/logout */
      logout: builder.mutation<void, void>({
        query: () => ({ url: 'auth/logout', method: 'POST' }),
      }),

      /**
       * PUT /api/auth/switch-entity-sector?selectedEntitySectorId=…
       * Returns the updated VerifyMeResponse so we can refresh state in one call.
       */
      switchEntitySector: builder.mutation<void, string>({
        query: (selectedEntitySectorId) => ({
          url: 'auth/switch-entity-sector',
          method: 'PUT',
          params: { selectedEntitySectorId },
          body: { selectedEntitySectorId },
        }),
        // Don't consume the response — it's missing assignedEntitySectors.
        // invalidatesTags triggers a fresh verifyMe fetch which has the full data.
        invalidatesTags: ['Auth'],
      }),
    }),
  });
}

export type SsoAuthApi = ReturnType<typeof createSsoAuthApi>;
