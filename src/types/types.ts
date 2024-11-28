import type { Hit } from "@algolia/client-search";

export type ProductRecord = Hit<{
  name: string;
  type: string[];
  date: number;
  description: string;
  title: string;
  geography: string[];
  thumbnail: string;
  slug: string;
  url?: string;
  hasRealThumbnail: boolean;
  hierarchicalCategories: {
    lvl0: string;
    lvl1?: string;
    lvl2?: string;
  };// Array for third-level category

  subject: string[];
  query?: string;
}>;

type WithAutocompleteAnalytics<THit> = THit & {
  __autocomplete_indexName: string;
  __autocomplete_queryID: string;
};

export type ProductHit = WithAutocompleteAnalytics<Hit<ProductRecord>>;
