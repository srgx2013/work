import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// vitest config augmentation — tsc -b under bundler resolution
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
      '@domain': '/src/domain',
      '@app': '/src/application',
      '@ui': '/src/ui',
    },
  },
  // @ts-expect-error — test property is added by vitest
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
    css: true,
  },
})