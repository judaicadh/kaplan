import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import partytown from "@astrojs/partytown";
import netlify from "@astrojs/netlify";
import fs from "node:fs";
import path from "node:path";

// Load your JSON file
const jsonPath = path.resolve(process.cwd(), "src/data/items.json");
const records = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

// Dynamic routes
const rawSearchCategories = records
  .flatMap((item) => item.hierarchicalCategories?.lvl0 ?? []);
const searchSlugs = Array.from(new Set(rawSearchCategories))
  .filter(Boolean)
  .map((cat) => `/search/${cat.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")}`);
const itemSlugs = records.map((item) => `/item/${item.slug}`);
const rawGeographies = records.flatMap((item) => item.geography ?? []);
const geographySlugs = Array.from(new Set(rawGeographies.map((geo) => geo.name)))
  .filter(Boolean)
  .map((name) => `/geography/${name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")}`);
const rawSubjects = records.flatMap((item) => item.subject ?? []);
const subjectSlugs = Array.from(new Set(rawSubjects))
  .filter(Boolean)
  .map((subject) => `/subject/${subject.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")}`);

export default defineConfig({
  site: "https://www.kaplancollection.org",
  base: "/",
  output: "server", // or 'hybrid', depending on your need
  adapter: netlify(),
  experimental: {
    session: true // ✅ this is the fix!
  },


  markdown: {
    rehypePlugins: [rehypeHeadingIds]
  },

  integrations: [
    react({ experimentalReactChildren: true }),
    tailwind(),
    icon({
      include: {
        mdi: ["magnify", "account-plus", "account-minus"]
      }
    }),
    sitemap({
      customPages: [
        "/",
        "/about",
        "/search",
        "collections",
        ...itemSlugs,
        ...subjectSlugs,
        ...geographySlugs,

      ]
    }),
    robotsTxt({
      policy: [{ userAgent: "*", allow: "/" }],
      sitemap: "https://www.kaplancollection.org/sitemap.xml"
    }),
    partytown(),
    netlify() // ✅ already included correctly
  ]
});