// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import netlify from "@astrojs/netlify";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import icon from "astro-icon";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import partytown from "@astrojs/partytown";

import markdoc from "@astrojs/markdoc";

export default defineConfig({
  site: "https://www.kaplancollection.org",
  base: "/",

  // If you want SSR on Netlify (Functions/Edge):
  output: "server",
  adapter: netlify(),

  // If you only want a static site instead, use:
  // output: "static",
  // (and remove `adapter`)

  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    rehypePlugins: [rehypeHeadingIds],
    // Or the simpler built-in option:
    // headingIds: true,
  },

  integrations: [
    react({ experimentalReactChildren: true }),
    icon({ include: { mdi: ["magnify", "account-plus", "account-minus"] } }),
    sitemap(),
    // ❌ Do NOT put netlify() here
    partytown(),
    markdoc(),
  ],
});