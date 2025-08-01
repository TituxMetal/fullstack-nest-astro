// @ts-check
import node from '@astrojs/node'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import icon from 'astro-icon'
import { defineConfig, envField } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  integrations: [react(), icon({ iconDir: 'src/assets/icons' })],
  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        }
      }
    },
    css: {
      // Ensure CSS is processed efficiently
      devSourcemap: false
    },
    build: {
      // Only keep safe CSS optimizations
      cssCodeSplit: false // Load all CSS together for faster rendering
    }
  },
  build: {
    // Only keep safe build optimizations
    inlineStylesheets: 'auto'
  },
  output: 'server',
  security: {
    checkOrigin: true
  },
  adapter: node({
    mode: 'standalone'
  }),
  env: {
    schema: {
      PUBLIC_API_URL: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
        default: '/api' // Default for dev, overridden in production
      }),
      API_URL: envField.string({
        context: 'server', // Server-side only
        access: 'secret',
        optional: true,
        default: 'http://localhost:3000' // Default for dev
      })
    }
  }
})
