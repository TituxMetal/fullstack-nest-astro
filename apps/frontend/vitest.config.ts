/// <reference types="vitest" />
import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
    environmentOptions: {
      jsdom: {
        resources: 'usable'
      }
    }
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
      '~ui': path.resolve(__dirname, './src/components/ui'),
      'astro:env/server': '/tests/mocks/astro-env.js',
      'astro:env/client': '/tests/mocks/astro-env.js'
    }
  }
})
