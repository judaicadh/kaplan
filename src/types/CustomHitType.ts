// CustomHitType.ts
import type { Hit as AlgoliaHit } from 'instantsearch.js/es/types';

export type CustomHitType = AlgoliaHit<{
	objectID: string;
	name: string;
	type: string[];
	subtype: string[];
	dateC: string;
	description: string;
	title: string;
	geography: string[];
	thumbnail: string;
	slug: string;
	url?: string;
	hasRealThumbnail: boolean;
	subject: string[];
	minTimestamp: number[];
	maxTimestamp: number[];
	_geoloc: {
		lat: number[] | number;
		lng: number[] | number;
	};
}>;