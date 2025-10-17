import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'XYZ Tours Driver',
        short_name: 'XYZ Driver',
        description: 'Driver portal for XYZ Tours and Travels',
        theme_color: '#059669',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.xyz-tours\.com\/api\/driver\/assignments/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'assignments-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 2 // 2 minutes
              }
            }
          },
          {
            urlPattern: /^https:\/\/tile\.openstreetmap\.org/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'map-tiles',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    port: 3002,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
