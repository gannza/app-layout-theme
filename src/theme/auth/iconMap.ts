// Eagerly import every icon from the local assets folder.
// Vite resolves these to hashed asset URLs at build time.
const _icons = import.meta.glob(
  '../../assets/icons/*.{png,svg,webp}',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>;

/**
 * Returns the bundled asset URL for a module icon filename (e.g. "recruitment.png").
 * Falls back to undefined if the file is not in the local assets folder.
 */
export function resolveModuleIcon(filename: string): string | undefined {
  const entry = Object.entries(_icons).find(([path]) =>
    path.endsWith(`/${filename}`),
  );
  return entry?.[1];
}
