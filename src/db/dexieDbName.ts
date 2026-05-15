/**
 * IndexedDB è per-origine (es. `user.github.io`), non per path.
 * Deriva il nome del DB dal `base` Vite così `/pizzawebapp/` → `pizzaweb-pizzawebapp`
 * e non collide con altre app sullo stesso dominio.
 *
 * Con `base: '/'` (dev / dominio dedicato) resta `pizzaweb` per compatibilità con installazioni precedenti.
 *
 * Override: variabile `VITE_DEXIE_NAME` nel file `.env`.
 */
export function resolvePizzappDexieName(baseUrl: string, override?: string | null): string {
  if (override?.trim()) return override.trim()

  const pathOnly = (baseUrl ?? '/').replace(/\/$/, '')
  if (pathOnly === '' || pathOnly === '/') return 'pizzaweb'

  const slug = pathOnly
    .replace(/^\//, '')
    .split('/')
    .filter(Boolean)
    .join('-')

  const safe = slug.replace(/[^a-zA-Z0-9_-]/g, '-') || 'app'
  return `pizzaweb-${safe}`
}

export function getPizzappDexieName(): string {
  return resolvePizzappDexieName(import.meta.env.BASE_URL, import.meta.env.VITE_DEXIE_NAME)
}
