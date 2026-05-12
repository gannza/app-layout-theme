import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { signRequest, decompressJSON } from './utils';
import type { SigningConfig } from './types';

const METHODS_WITH_BODY = new Set(['POST', 'PUT', 'PATCH']);

function normalizeBaseUrl(ssoBaseUrl: string): string {
  const base = ssoBaseUrl.endsWith('/') ? ssoBaseUrl : `${ssoBaseUrl}/`;
  return `${base}api/`;
}

function mergeHeaders(
  existing: HeadersInit | Headers | undefined,
  extra: Record<string, string>,
): Headers {
  const h = new Headers(existing as HeadersInit | undefined);
  Object.entries(extra).forEach(([k, v]) => h.set(k, v));
  return h;
}

export function createAuthBaseQuery(
  ssoBaseUrl: string,
  signingConfig: SigningConfig | null,
  encryptionEnabled: boolean,
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> {
  const rawBase = fetchBaseQuery({
    baseUrl: normalizeBaseUrl(ssoBaseUrl),
    credentials: 'include',
  });

  /** Adds HMAC headers (and Content-Type only for body-bearing methods) */
  const withHmac = async (
    args: string | FetchArgs,
  ): Promise<string | FetchArgs> => {
    if (!signingConfig?.signingSecret || !signingConfig.clientId) return args;

    const norm: FetchArgs =
      typeof args === 'string' ? { url: args } : { ...args };

    const method = (norm.method ?? 'GET').toUpperCase();
    const body = norm.body ?? norm.params ?? {};
    const { signature, timestamp } = await signRequest(
      signingConfig.signingSecret,
      body,
    );
    const extra: Record<string, string> = {
      'X-Client-ID': signingConfig.clientId,
      'X-Timestamp': timestamp,
      'X-Signature': signature,
    };
    if (METHODS_WITH_BODY.has(method)) {
      extra['Content-Type'] = 'application/json';
    }
    return {
      ...norm,
      headers: mergeHeaders(norm.headers as HeadersInit | undefined, extra),
    };
  };

  type BaseResult = Awaited<ReturnType<typeof rawBase>>;

  /** Optionally decompresses the response body (only for success results) */
  const maybeDecompress = (result: BaseResult): BaseResult => {
    if (!encryptionEnabled || result.error !== undefined || !result.data)
      return result;
    const decompressed = decompressJSON(result.data);
    // Cast is safe — we are in the success branch, only replacing `data`
    return { data: decompressed, meta: result.meta } as BaseResult;
  };

  /** Full base query: HMAC + 401-reauth + decompression */
  const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
  > = async (args, api, extraOptions) => {
    const signed = await withHmac(args);
    let result = maybeDecompress(await rawBase(signed, api, extraOptions));

    if (result.error?.status === 401) {
      const refreshSigned = await withHmac({
        url: 'auth/refresh',
        method: 'POST',
      });
      const refreshResult = await rawBase(refreshSigned, api, extraOptions);

      if (!refreshResult.error) {
        // Retry original request after successful refresh
        const retrySigned = await withHmac(args);
        result = maybeDecompress(
          await rawBase(retrySigned, api, extraOptions),
        );
      }
      // If refresh also fails, fall through and return the 401 error —
      // AuthInit handles the redirect via useEffect on the error state.
    }

    return result;
  };

  return baseQueryWithReauth;
}
