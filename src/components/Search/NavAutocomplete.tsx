import { algoliasearch } from 'algoliasearch'
import React, { useEffect, useRef, createElement, Fragment } from "react";
import { createRoot } from "react-dom/client";
import { autocomplete, type AutocompleteOptions, getAlgoliaFacets, getAlgoliaResults } from '@algolia/autocomplete-js'
import { createRedirectUrlPlugin } from "@algolia/autocomplete-plugin-redirect-url";
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions'
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches'

import type { AutocompleteComponents } from "@algolia/autocomplete-js";
import type { Hit } from "@algolia/client-search";
import type { Root } from "react-dom/client";
import "@algolia/autocomplete-theme-classic/dist/theme.css";
import { useSearchBox } from "react-instantsearch";

import type { ProductHit } from '../../types/types'
import type { BaseItem } from '@algolia/autocomplete-core'
const searchClient = algoliasearch(
	'ZLPYTBTZ4R',
	'be46d26dfdb299f9bee9146b63c99c77'
);
const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
	key: 'navbar'
})

function NavAutocomplete() {
	const containerRef = useRef<HTMLDivElement | null>(null)
	const panelRootRef = useRef<Root | null>(null)
	const rootRef = useRef<HTMLElement | null>(null)

	// Normalization function
	const normalizeValue = (value: string) =>
		value
			.toLowerCase()
			.replace(/ > /g, '_')
			.replace(/\//g, '_')
			.replace(/,/g, '_')
			.replace(/&/g, 'and')
			.replace(/ /g, '_')
			.replace(/[()]/g, '')
			.replace(/[^a-z0-9_,|]/g, '')

	useEffect(() => {
		if (!containerRef.current) {
			return undefined
		}

		const search = autocomplete({
			container: containerRef.current,
			placeholder: 'Search',
			detachedMediaQuery: '',
			openOnFocus: true,
			insights: true,
			plugins: [recentSearchesPlugin],
			getSources({ query }) {
				if (!query) {
					return []
				}
				return [
					{
						sourceId: 'nameCategories',
						getItems({ query }) {
							return getAlgoliaFacets({
								searchClient,
								queries: [
									{
										indexName: 'Dev_Kaplan',
										facet: 'name',
										params: {
											facetQuery: query,
											maxFacetHits: 2
										},
									},
								],
							});
						},
						templates: {
							header() {
								return (
									<Fragment>
										<span className="aa-SourceHeaderTitle">Names</span>
										<div className="aa-SourceHeaderLine" />
									</Fragment>
								)
							},
							item({ item }) {
								return (
									<a
										href={`/search/?name=${(item.label)}`}
										className="text-blue-500 underline"
									>
										{item.label}
									</a>
								);
							},
						},
					},
					{
						sourceId: 'geographyCategories',
						getItems({ query }) {
							return getAlgoliaFacets({
								searchClient,
								queries: [
									{
										indexName: 'Dev_Kaplan',
										facet: 'geography',
										params: {
											facetQuery: query,
											maxFacetHits: 2
										}
									}
								]
							})
						},
						templates: {
							header() {
								return (
									<Fragment>
										<span className="aa-SourceHeaderTitle">Geography</span>
										<div className="aa-SourceHeaderLine" />
									</Fragment>
								)
							},
							item({ item }) {
								return (
									<a
										href={`/search/?geography=${normalizeValue(item.label)}`}
										className="text-blue-500 underline"
									>
										{item.label}
									</a>
								)
							}
						}
					},
					{
						sourceId: 'FormCategories',
						getItems({ query }) {
							return getAlgoliaFacets({
								searchClient,
								queries: [
									{
										indexName: 'Dev_Kaplan',
										facet: 'hierarchicalCategories.lvl1',
										params: {
											facetQuery: query,
											maxFacetHits: 2
										}
									}
								]
							})
						},
						templates: {
							header() {
								return (
									<Fragment>
										<span className="aa-SourceHeaderTitle">Form</span>
										<div className="aa-SourceHeaderLine" />
									</Fragment>
								)
							},
							item({ item }) {
								return (
									<a
										href={`/search/?hierarchicalCategories=${normalizeValue(
											item.label
										)}`}
										className="text-blue-500 underline"
									>
										{item.label}
									</a>
								)
							}
						}
					},
					{
						sourceId: 'products',
						getItems() {
							return getAlgoliaResults({
								searchClient,
								queries: [
									{
										indexName: 'Dev_Kaplan',
										params: {
											query
										}
									}
								]
							})
						},
						templates: {
							header() {
								return (
									<Fragment>
										<span className="aa-SourceHeaderTitle">Items</span>
										<div className="aa-SourceHeaderLine" />
									</Fragment>
								)
							},

							item({ item, components }) {
								return (
									<ProductItem
										hit={item}
										components={components}
										normalizeValue={normalizeValue}
									/>
								)
							},
							noResults() {
								return 'No products for this query.'
							},
						},
					},
				];
			},

			onSubmit({ state }) {
				const query = state.query
				if (query.trim()) {
					window.location.href = `/search/?query=${encodeURIComponent(query)}`
				}
			},
			renderer: {
				createElement,
				Fragment,
				render: () => {
				}
			},
			render({ children }, root) {
				if (!panelRootRef.current || rootRef.current !== root) {
					rootRef.current = root

					panelRootRef.current?.unmount()
					panelRootRef.current = createRoot(root)
				}

				panelRootRef.current.render(children)
			},
		});

		return () => {
			search.destroy()
		};
	}, []);

	return <div ref={containerRef} />
}

function ProductItem({
											 hit,
											 components,
											 normalizeValue
										 }: {
	hit: ProductHit;
	components: AutocompleteComponents;
	normalizeValue: (value: string) => string;
}) {
	return (
		<article className="aa-ItemWrapper">
			<div className="aa-ItemContent">
				<div className="aa-ItemIcon--picture">
					<a href={`/item/${normalizeValue(hit.slug)}`}>
						<img src={hit.thumbnail} alt={hit.title} />
					</a>
				</div>
				<a href={`/item/${normalizeValue(hit.slug)}`}>
					<div className="mt-6 aa-ItemContentTitle">
						<components.Highlight hit={hit} attribute="title" />
					</div>
					<div className="aa-ItemContentDescription">
						<components.Snippet hit={hit} attribute="description" />
					</div>
				</a>
			</div>
			<hr />
		</article>
	);
}

export default NavAutocomplete;

