import { defineConfig } from 'astro/config';
import vue from "@astrojs/vue";
import react from "@astrojs/react";
import tailwind from '@astrojs/tailwind';

export default defineConfig({

  site: 'https://judaicadh.github.io/kaplan',

  // Necessary for GitHub Pages
  // Integrations and other settings
  base: '/kaplan/',
  integrations: [vue(), react(), tailwind()]
});