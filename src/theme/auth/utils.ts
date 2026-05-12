import { inflate } from 'pako';
import type { AssignedEntitySector, VerifyMeResponse } from './types';
import type { ShellInstitution, ShellUser } from '../shell/types';

// ── Pure-JS SHA-256 / HMAC (works without a secure context) ──────────────────

function rotr32(x: number, n: number): number {
  return (x >>> n) | (x << (32 - n));
}

function sha256Bytes(data: Uint8Array): Uint8Array {
  const K = [
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2,
  ];
  let [h0,h1,h2,h3,h4,h5,h6,h7] = [
    0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,
    0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19,
  ];
  const bitLen = data.length * 8;
  const padLen = data.length % 64 < 56 ? 56 - (data.length % 64) : 120 - (data.length % 64);
  const padded = new Uint8Array(data.length + padLen + 8);
  padded.set(data);
  padded[data.length] = 0x80;
  const dv = new DataView(padded.buffer);
  dv.setUint32(padded.length - 4, bitLen >>> 0, false);
  dv.setUint32(padded.length - 8, Math.floor(bitLen / 2 ** 32), false);
  const w = new Uint32Array(64);
  for (let i = 0; i < padded.length; i += 64) {
    for (let j = 0; j < 16; j++) w[j] = dv.getUint32(i + j * 4, false);
    for (let j = 16; j < 64; j++) {
      const s0 = rotr32(w[j-15],7) ^ rotr32(w[j-15],18) ^ (w[j-15] >>> 3);
      const s1 = rotr32(w[j-2],17) ^ rotr32(w[j-2],19) ^ (w[j-2] >>> 10);
      w[j] = (w[j-16] + s0 + w[j-7] + s1) >>> 0;
    }
    let [a,b,c,d,e,f,g,h] = [h0,h1,h2,h3,h4,h5,h6,h7];
    for (let j = 0; j < 64; j++) {
      const S1 = rotr32(e,6) ^ rotr32(e,11) ^ rotr32(e,25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (h + S1 + ch + K[j] + w[j]) >>> 0;
      const S0 = rotr32(a,2) ^ rotr32(a,13) ^ rotr32(a,22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) >>> 0;
      h=g; g=f; f=e; e=(d+t1)>>>0; d=c; c=b; b=a; a=(t1+t2)>>>0;
    }
    h0=(h0+a)>>>0; h1=(h1+b)>>>0; h2=(h2+c)>>>0; h3=(h3+d)>>>0;
    h4=(h4+e)>>>0; h5=(h5+f)>>>0; h6=(h6+g)>>>0; h7=(h7+h)>>>0;
  }
  const out = new Uint8Array(32);
  const odv = new DataView(out.buffer);
  [h0,h1,h2,h3,h4,h5,h6,h7].forEach((v,i) => odv.setUint32(i*4, v, false));
  return out;
}

function hmacSha256Pure(keyBytes: Uint8Array, msgBytes: Uint8Array): Uint8Array {
  const B = 64;
  let k = keyBytes.length > B ? sha256Bytes(keyBytes) : keyBytes;
  const ipad = new Uint8Array(B); ipad.set(k); for (let i=0;i<B;i++) ipad[i]^=0x36;
  const opad = new Uint8Array(B); opad.set(k); for (let i=0;i<B;i++) opad[i]^=0x5c;
  const inner = new Uint8Array(B + msgBytes.length);
  inner.set(ipad); inner.set(msgBytes, B);
  const innerHash = sha256Bytes(inner);
  const outer = new Uint8Array(B + 32);
  outer.set(opad); outer.set(innerHash, B);
  return sha256Bytes(outer);
}

// ── HMAC signing ──────────────────────────────────────────────────────────────

export async function signRequest(
  secret: string,
  body: unknown,
): Promise<{ timestamp: string; signature: string }> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const serialized = JSON.stringify(body);
  const payload = timestamp + serialized;
  const enc = new TextEncoder();

  // Prefer Web Crypto (secure context) — fall back to pure-JS when unavailable
  if (globalThis.crypto?.subtle) {
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );
    const buf = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
    const signature = Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return { timestamp, signature };
  }

  // Pure-JS fallback (works on HTTP / non-secure contexts)
  const sigBytes = hmacSha256Pure(enc.encode(secret), enc.encode(payload));
  const signature = Array.from(sigBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return { timestamp, signature };
}

// ── Pako decompression ────────────────────────────────────────────────────────

export function decompressJSON(compressedData: unknown): unknown {
  try {
    const d = compressedData as Record<string, unknown>;
    if (!d?._data_) return compressedData;
    const decompressedStr = inflate(d._data_ as Uint8Array, { to: 'string' });
    return JSON.parse(decompressedStr);
  } catch {
    return compressedData;
  }
}

// ── SSO redirect ──────────────────────────────────────────────────────────────

export function buildLoginUrl(ssoBaseUrl: string, serviceName: string): string {
  const base = ssoBaseUrl.endsWith('/') ? ssoBaseUrl : `${ssoBaseUrl}/`;
  return `${base}signin/?service=${encodeURIComponent(serviceName)}&continue=${encodeURIComponent(window.location.origin)}`;
}

export function redirectToLogin(ssoBaseUrl: string, serviceName: string): void {
  window.location.replace(buildLoginUrl(ssoBaseUrl, serviceName));
}

// ── Data mappers ──────────────────────────────────────────────────────────────

function extractAcronym(name: string): string {
  const match = name.match(/\(([^)]+)\)/);
  if (match) return match[1];
  // Fallback: initials of first 4 words
  return name
    .split(/\s+/)
    .slice(0, 4)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export function mapEntitySectorToInstitution(
  sector: AssignedEntitySector,
): ShellInstitution {
  return {
    id: sector.id,
    name: sector.name,
    acronym: extractAcronym(sector.name),
  };
}

export function mapVerifyMeToUser(
  data: VerifyMeResponse,
  onLogout: () => void,
): ShellUser {
  return {
    name: `${data.firstName} ${data.lastName}`,
    email: data.email,
    subtitle: data.selectedEntitySector?.name ?? undefined,
    menuItems: [
      {
        id: 'sso-logout',
        label: 'Sign out',
        onSelect: onLogout,
        danger: true,
      },
    ],
  };
}
