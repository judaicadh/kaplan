import type { Hit } from '@algolia/client-search'

// Define the ProductRecord type
export type ProductRecord = {
	name: string;
  type: string[];
	date: number; // Assuming date is stored as a UNIX timestamp
  description: string;
  title: string;
	geographic_subject: string[];
  thumbnail: string;
  slug: string;
	url?: string; // Optional URL for the item
  hasRealThumbnail: boolean;
  hierarchicalCategories: {
    lvl0: string;
		lvl1?: string; // Optional for second-level categories
		lvl2?: string; // Optional for third-level categories
	};
  subject: string[];
	query?: string; // Query for autocomplete suggestions
};

// Add autocomplete analytics data to the hit
type WithAutocompleteAnalytics<Hit> = Hit & {
	__autocomplete_indexName: string; // Index name for analytics
	__autocomplete_queryID: string;  // Query ID for analytics
};

export type ProductHit = WithAutocompleteAnalytics<Hit<ProductRecord>>;