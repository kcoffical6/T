import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://xyztours.com',
  base: '/',
  output: 'static',

  integrations: [
    react({
      include: ['**/react/*'],
    }),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      filter: (page) => !page.includes('admin') && !page.includes('driver'),
    }),
  ],

  vite: {
    define: {
      'process.env': process.env,
    },
  },

  build: {
    assets: 'assets',
  },

  image: {
    domains: ['images.unsplash.com', 'xyztours.com'],
  },

  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
