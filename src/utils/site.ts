// Single source of truth for the site's canonical origin and identifiers.
// Keep this in sync with `site` in astro.config.mjs and the CNAME file.
// Using one host everywhere keeps canonical tags, the sitemap, Open Graph
// URLs, and JSON-LD @ids from disagreeing (which splits indexing signals).

export const SITE_URL = "https://www.kaplancollection.org";

export const SITE_NAME =
	"Arnold & Deanne Kaplan Collection of Early American Judaica";

export const SITE_ORG =
	"Judaica Digital Humanities at the University of Pennsylvania Libraries";

export const SITE_DESCRIPTION =
	"Discover prints, manuscripts, ephemera, newspapers, and artifacts documenting early American and Atlantic Jewish life.";

// Stable @ids for the site-wide linked-data graph.
export const WEBSITE_ID = `${SITE_URL}#website`;
export const ORG_ID = `${SITE_URL}#org`;
