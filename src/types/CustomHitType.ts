// CustomHitType.ts
import type { Hit as AlgoliaHit } from 'instantsearch.js/es/types';

import type { ProductRecord } from './types.ts'

export type CustomRecord = AlgoliaHit<{
	objectID: string;
	name: string;
	language: string;
	dateC: string;
	description: string;
	title: string;
	geographic_subject: string[];
	thumbnail: string;
	slug: string;
	url?: string;
	hierarchicalCategories: string[];
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
