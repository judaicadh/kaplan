import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";
import fs from "node:fs";
import path from "node:path";
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
  output: "server",
  adapter: netlify(),


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
      sitemap: "https://www.kaplancollection.org/sitemap-index.xml"
    }),
    partytown(),
    netlify()
  ]
});