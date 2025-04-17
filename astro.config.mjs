import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";

import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import partytown from "@astrojs/partytown";



export default defineConfig({
  site: "https://www.kaplancollection.org",
  base: "/",
  output: "server", // or 'hybrid'
  adapter: netlify(),

  vite: {
    optimizeDeps: {
      include: ["@mui/utils/chainPropTypes"]
    },
    ssr: {
      noExternal: ["@mui/material", "@mui/utils"]
    }
  },

  experimental: {
    session: true
  },

  markdown: {
    rehypePlugins: [rehypeHeadingIds]
  },

  integrations: [
    react({ experimentalReactChildren: true }),
    tailwind(),
    icon({ include: { mdi: ["magnify", "account-plus", "account-minus"] } }),
    sitemap(),
    robotsTxt({
      policy: [{ userAgent: "*", allow: "/" }],
      sitemap: "https://www.kaplancollection.org/sitemap.xml"
    }),
    partytown(),
    netlify()
  ]
});