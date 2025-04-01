import { defineConfig, passthroughImageService } from 'astro/config'
import robotsTxt from 'astro-robots-txt'
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";

import { rehypeHeadingIds } from "@astrojs/markdown-remark";
export default defineConfig({
  site: 'https://www.kaplancollection.org', // Update to your canonical URL
  prefetch: true,
  markdown: {
    rehypePlugins: [rehypeHeadingIds]
  },
  vite: {
    resolve: {
      alias: {
        '@mui/icons-material': '@mui/icons-material/esm',
      },
    },
    ssr: {
      noExternal: /@mui\/.*?/,
    },
    optimizeDeps: {
      include: ['algoliasearch']
    },
  },
  base: '/', // Adjust for subfolder deployment if needed
  typescript: {
    tsconfig: './tsconfig.json'
  },
  integrations: [
    react({ experimentalReactChildren: true }),
    tailwind(),
    icon({
      include: {
        mdi: ['magnify', 'account-plus', 'account-minus']
      }
    }),
    sitemap(),
    robotsTxt({
      policy: [
        {
          userAgent: '*',
          allow: '/'
        }
      ],
      sitemap: 'https://www.kaplancollection.org/sitemap.xml'
    })
  ]
})