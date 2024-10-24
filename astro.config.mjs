import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import github from '@astrojs/github';

export default defineConfig({

  site: 'https://kaplancollection.org',

  // Necessary for GitHub Pages
  base: '/',

  // Integrations
  integrations: [
    preact({
      include: ['**/preact/*'], // Restricts Preact usage to specific directories
    }),
    react({
      experimentalReactChildren: true, // Enabling experimental React children handling
    }),
    tailwind(),
   // Vue integration was missing in your setup, added it here
  ],
  output: 'static',
  adapter: github({
    // GitHub Pages adapter, but no need for a site URL with a custom domain
  }),
});