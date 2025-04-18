import { algoliasearch } from 'algoliasearch'
import React, { useEffect, useRef, createElement, Fragment, type ReactNode } from "react";
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
	key: 'search'
})

function slugify(str: string): string {
	return str
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-")
		.replace(/[^\w\-]+/g, "")
		.replace(/\-\-+/g, "-")
		.replace(/^-+/, "")
		.replace(/-+$/, "");
}

function getSearchUrl(params: Record<string, string | string[]>) {
	const searchParams = new URLSearchParams();

	const paramMap: Record<string, string> = {
		"name": "name",
		"collection": "collection",
		"subject": "subject",
		"geography.name": "geography",
		"hierarchicalCategories.lvl0": "hierarchicalCategories"
	};

	for (const [key, value] of Object.entries(params)) {
		const urlKey = paramMap[key] || key;
		if (Array.isArray(value)) {
			value.forEach((v) => searchParams.append(urlKey, slugify(v)));
		} else {
			searchParams.append(urlKey, slugify(value));
		}
	}

	return `/search/?${searchParams.toString()}`;
}

function NavAutocomplete() {
	const containerRef = useRef<HTMLDivElement | null>(null)
	const panelRootRef = useRef<Root | null>(null)
	const rootRef = useRef<HTMLElement | null>(null)

	// Normalization function

	useEffect(() => {
		if (!containerRef.current) return;

		const search = autocomplete({
			container: containerRef.current,
			placeholder: 'Search',
			detachedMediaQuery: '',
			openOnFocus: true,
			insights: true,

			classNames: {
				panel: "max-h-[400px] flex flex-col overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900",
				list: "overflow-y-auto grow",
				input: "text-base text-gray-800"
			},
			plugins: [recentSearchesPlugin],
			getSources({ query }) {
				if (!query) {
					return []
				}
				return [

					{
						sourceId: 'geographyCategories',
						getItems({ query }) {
							return getAlgoliaFacets({
								searchClient,
								queries: [
									{
										indexName: 'Dev_Kaplan',
										facet: "geography.name",
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
										href={`/geography/${encodeURIComponent(slugify(item.label))}`}
										className="text-blue-500 hover:underline"
									>

										{item.label}
									</a>
								);
							}
						}
					},

					{
						sourceId: "subjectCategories",
						getItems({ query }) {
							return getAlgoliaFacets({
								searchClient,
								queries: [
									{
										indexName: "Dev_Kaplan",
										facet: "subject",
										params: {
											facetQuery: query,
											maxFacetHits: 2
										}
									}
								]
							});
						},
						templates: {
							header() {
								return (
									<Fragment>
										<span className="aa-SourceHeaderTitle">Subject</span>
										<div className="aa-SourceHeaderLine" />
									</Fragment>
								);
							},
							item({ item }) {
								return (
									<a
										href={`/subject/${encodeURIComponent(slugify(item.label))}`}
										className="text-blue-500 hover:underline"
									>
										{item.label}
									</a>
								);
							}
						}
					},
					/*{
						sourceId: 'FormCategories',
						getItems({ query }) {
							return getAlgoliaFacets<ProductHit>({
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
										href={`/search/?hierarchicalCategories=${(
											item.label
										)}`}
										className="text-blue-500 underline"
									>
										{item.label}
									</a>
								)
							}
						}
					},*/
					{
						sourceId: 'products',
						getItems() {
							return getAlgoliaResults<ProductHit>({
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
									<span
										className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 px-3 py-1 block border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
  Geography
</span>
								)
							},

							item({ item, components }) {
								return (
									<ProductItem
										hit={item}
										components={components}

									/>
								);
							},
							noResults() {
								return "No results for this query.";
							},
							footer({ state }): ReactNode {
								return (
									<div
										className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-10 p-3">
										<a
											href={getSearchUrl({ query: state.query })}
											className="text-sm text-center text-blue-600 hover:underline block"
										>
											See all results for “{state.query}”
										</a>
									</div>
								);
							}
						},
					},
					{
						sourceId: "nameCategories",
						getItems({ query }) {
							return getAlgoliaFacets({
								searchClient,
								queries: [
									{
										indexName: "Dev_Kaplan",
										facet: "name", // Update this to your facet attribute
										params: {
											facetQuery: query,
											maxFacetHits: 5
										}
									}
								]
							});
						},
						templates: {
							item({ item }) {
								return <a href={getSearchUrl({ name: item.label })}>{item.label}</a>;


							}

						}
					}
				];
			},

			onSubmit({ state }) {
				const query = state.query.trim();
				if (query) {
					window.location.href = `/search/?query=${encodeURIComponent(query)}`;
				}
			},
			renderer: {
				createElement: (type: any, props: any, ...children: any[]) => {
					return React.createElement(type, props, ...children);
				},
				Fragment: React.Fragment
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
											 components
										 }: {
	hit: ProductHit;
	components: AutocompleteComponents;
}) {
	return (
		<article className="aa-ItemWrapper">
			<div className="aa-ItemContent">
				<div className="aa-ItemIcon--picture">
					<a
						href={`/item/${hit.slug}`}
						aria-label={`View details for ${hit.title}`}
					>
						<img
							src={hit.thumbnail || '/default-thumbnail.png'}
							alt={hit.title || 'No title available'}
						/>
					</a>
				</div>
				<a href={`/item/${hit.slug}`} aria-label={`View details for ${hit.title}`}>
					<div className="mt-6 aa-ItemContentTitle">
						<components.Highlight
							hit={hit}
							attribute="title"
						/>
					</div>
					<div className="aa-ItemContentDescription">
						<components.Snippet
							hit={hit}
							attribute="description"
						/>
					</div>
				</a>
			</div>
			<hr />
		</article>
	);
}
export default NavAutocomplete;