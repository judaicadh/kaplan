import type { Hit as AlgoliaHit } from '@algolia/client-search'
import React from 'react'
import { Highlight, Snippet } from 'react-instantsearch'

// Define the ProductRecord type
type HitProps = {
	hit: AlgoliaHit<{
		name?: string[];
		type: string[];
		date: number; // Assuming date is stored as a UNIX timestamp
		description: string;
		title: string;
		geography?: string[];
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
	}>;
};

export function Hit({ hit }: HitProps) {
	return (
		<article className="aa-ItemWrapper flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg">
			{/* Thumbnail Section */}
			<div className="aa-ItemIcon--picture w-12 h-12">
				<a href={`/item/${hit.slug}`} aria-label={`Item: ${hit.title}`}>
					<img
						src={hit.thumbnail}
						alt={hit.title}
						className="w-full h-full object-cover rounded-md"
					/>
				</a>
			</div>

			{/* Content Section */}
			<div>
				<a href={`/item/${hit.slug}`}>
					{/* Title with Highlight */}
					<h3 className="text-sm font-medium text-gray-800">
						<Highlight hit={hit} attribute="title" />
					</h3>
					{/* Description with Snippet */}
					<p className="text-xs text-gray-500">
						<Snippet hit={hit} attribute="description" />
					</p>
				</a>
			</div>
		</article>
	);
}