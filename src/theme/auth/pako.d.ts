declare module 'pako' {
  export function inflate(data: Uint8Array | ArrayBuffer | string, options: { to: 'string' }): string;
  export function inflate(data: Uint8Array | ArrayBuffer | string): Uint8Array;
  export function deflate(data: Uint8Array | ArrayBuffer | string): Uint8Array;
}
