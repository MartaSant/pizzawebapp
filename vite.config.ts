/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// GitHub Pages (project site): stesso `github.io` per più repo → imposta `base` al nome repo.
// Esempio: `base: '/pizzawebapp/'` così IndexedDB sarà `pizzaweb-pizzawebapp`, distinto da altre app.
// Vedi `src/db/dexieDbName.ts`. Override: `VITE_DEXIE_NAME` in `.env`.
export default defineConfig({
  // base: '/pizzawebapp/',
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
