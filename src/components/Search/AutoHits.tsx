import React from 'react'

type HitProps = {
	hit: {
		Dev_Kaplan: {
			exact_nb_hits: number;
			facets: {
				exact_matches: {
					geography: { value: string; count: number }[];
					'hierarchicalCategories.lvl0': { value: string; count: number }[];
					'hierarchicalCategories.lvl1': { value: string; count: number }[];
					'hierarchicalCategories.lvl2': { value: string; count: number }[];
				};
			};
		};
	};
};

export function AutoHits({ hit }: HitProps) {
	const { Dev_Kaplan } = hit
	const { exact_matches } = Dev_Kaplan.facets

	// Extract geography
	const geography =
		exact_matches.geography?.map((geo) => `${geo.value} (${geo.count})`).join(', ') ||
		'Unknown location'

	// Extract categories
	const categories = [
		...(exact_matches['hierarchicalCategories.lvl2'] || []),
		...(exact_matches['hierarchicalCategories.lvl1'] || []),
		...(exact_matches['hierarchicalCategories.lvl0'] || [])
	]
		.map((cat) => `${cat.value} (${cat.count})`)
		.join(', ') || 'Uncategorized'

	return (
		<article className="hit">
			<div>
				<h2>Locations</h2>
				<p>{geography}</p>
			</div>
			<div>
				<h2>Categories</h2>
				<p>{categories}</p>
			</div>
		</article>
	)
}