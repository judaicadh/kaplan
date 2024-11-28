// CustomHitType.ts
import type { Hit as AlgoliaHit } from 'instantsearch.js/es/types';

import type { ProductRecord } from './types.ts'

export type CustomRecord = AlgoliaHit<{
	objectID: string;
	name: string;


	dateC: string;
	description: string;
	title: string;
	geography: string[];
	thumbnail: string;
	slug: string;
	url?: string;
	hierarchicalCategories: {
		'lvl0': string; // Top-level category
		'lvl1': string; // Second-level category
		'lvl2': string; // Third-level category
	};
	hasRealThumbnail: boolean;
	subject: string[];
	_geoloc: {
		lat: number[] | number;
		lng: number[] | number;
	};
}>;

type WithAutocompleteAnalytics<THit> = THit & {
	__autocomplete_indexName: string;
	__autocomplete_queryID: string;
};

export type CustomHit = WithAutocompleteAnalytics<AlgoliaHit<CustomRecord>>;
