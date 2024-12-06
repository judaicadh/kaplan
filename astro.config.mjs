import { defineConfig, passthroughImageService } from 'astro/config'

import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";

export default defineConfig({
  site: "https://kaplancollection.org",

  prefetch: true,
  vite: {
    resolve: {
      alias: {
        // alias icons to their ESM version
        '@mui/icons-material': '@mui/icons-material/esm',
      },
    },
    ssr: {
      noExternal: /@mui\/.*?/,
    },
    optimizeDeps: {
      include: ['algoliasearch']
    },
  }, // Close vite object here
  base: "/", // For GitHub Pages, adjust if deploying to a subfolder

  typescript: {
    tsconfig: "./tsconfig.json", // Path to TypeScript config
  },

  integrations: [react({
    experimentalReactChildren: true // Enables experimental React children handling
  }), tailwind(), icon({
    include: {
      // Include only three `mdi` icons in the bundle
      mdi: ['magnify', 'account-plus', 'account-minus']
      // Include all `uis` icons
    }
  }), sitemap(), robotsTxt()]
});