import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import partytown from "@astrojs/partytown";

import fs from "node:fs";
import path from "node:path";

// Load your JSON file
const jsonPath = path.resolve(process.cwd(), "src/data/items.json");
const records = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

// Extract /item/[slug] routes
const itemSlugs = records.map((item) => `/item/${item.slug}`);

// Extract /subject/[slug] routes from `subject` and/or `subjectAI`
const rawSubjects = records.flatMap((item) =>
  item.subject || [] // or item.subjectAI.map(s => s.name) if you prefer
);

// Deduplicate and slugify subject names
const subjectSlugs = Array.from(new Set(rawSubjects))
  .filter(Boolean)
  .map((subject) =>
    `/subject/${subject
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove punctuation
      .replace(/\s+/g, "-")}`   // Replace spaces with hyphens
  );

export default defineConfig({
  site: "https://www.kaplancollection.org",
  base: "/",
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
        ...itemSlugs,
        ...subjectSlugs
      ]
    }),
    robotsTxt({
      policy: [{ userAgent: "*", allow: "/" }],
      sitemap: "https://www.kaplancollection.org/sitemap.xml"
    }),
    partytown()
  ]
});