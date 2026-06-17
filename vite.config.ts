import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'prompt',
        devOptions: {
          enabled: true
        },
        workbox: {
          importScripts: ['/sw-push.js'],
          // Public klasöründeki statik dosyaları da önbellek takibine al.
          // Bu sayede logo vb. değiştiğinde servis çalışanı güncellenir.
          globPatterns: [
            '**/*.{js,css,html,ico,svg,woff,woff2,webp}',
            'logo*.{png,jpg}',
          ],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
            },
          ],
        },
        manifest: {
          name: 'PDKS Uygulaması',
          short_name: 'PDKS',
          description: 'Personel Devam Kontrol Sistemi',
          theme_color: '#09090b',
          background_color: '#09090b',
          display: 'standalone',
          icons: [
            {
              src: '/logo192-v2.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/logo512-v2.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
