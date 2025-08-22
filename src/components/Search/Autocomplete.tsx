import {  algoliasearch } from "algoliasearch";
import type { BaseItem } from '@algolia/autocomplete-core';
import { type AutocompleteOptions, getAlgoliaFacets } from "@algolia/autocomplete-js";
import { useRefinementList } from 'react-instantsearch';

import {
	createElement,
	Fragment,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { createRoot, type Root } from 'react-dom/client';

import {
	useHierarchicalMenu,
	usePagination,
	useSearchBox,
} from 'react-instantsearch';
import { autocomplete } from '@algolia/autocomplete-js';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { debounce } from '@algolia/autocomplete-shared';
const searchClient = algoliasearch(
	'ZLPYTBTZ4R',
	'be46d26dfdb299f9bee9146b63c99c77'
);
import {
	INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTES,
	INSTANT_SEARCH_INDEX_NAME,
	INSTANT_SEARCH_QUERY_SUGGESTIONS,
} from '../../constants.ts';

import '@algolia/autocomplete-theme-classic';

type AutocompleteProps = Partial<AutocompleteOptions<BaseItem>> & {
	searchClient: any,
	className?: string;
};

type SetInstantSearchUiStateOptions = {
	query: string;
	category?: string;
	geography?: string;
	name?: string;
	subject?: string;
};

type MyRecentSearchItem = {
	id: string; // ✅ required
	label: string;
	category?: string;
	geography?: string;
	name?: string;
	subject?: string;
};
export function Autocomplete({
															 searchClient,
															 className,
															 ...autocompleteProps
														 }: AutocompleteProps) {
	const autocompleteContainer = useRef<HTMLDivElement>(null);
	const panelRootRef = useRef<Root | null>(null);
	const rootRef = useRef<HTMLElement | null>(null);

	const { query, refine: setQuery } = useSearchBox();
	const { items: categories, refine: setCategory } = useHierarchicalMenu({
		attributes: INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTES,
	});
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
	const { items: name,  refine: setName } = useRefinementList({ attribute: 'name' });
	const { refine: setGeography } = useRefinementList({ attribute: 'geography.name' });
	const { refine: setSubject } = useRefinementList({ attribute: 'subject' });
	const { refine: setPage } = usePagination();

	const [instantSearchUiState, setInstantSearchUiState] =
		useState<SetInstantSearchUiStateOptions>({ query });
	const debouncedSetInstantSearchUiState = debounce(
		setInstantSearchUiState,
		500
	);

	useEffect(() => {
		setQuery(instantSearchUiState.query);
		if (instantSearchUiState.category) {
			setCategory(instantSearchUiState.category);
		}

		if (instantSearchUiState.geography) {
			setGeography(instantSearchUiState.geography);
		}
		if (instantSearchUiState.name) {
			setName(instantSearchUiState.name);
		}
		if (instantSearchUiState.subject) {
			setSubject(instantSearchUiState.subject);
		}
		setPage(0);
	}, [instantSearchUiState]);
	const currentCategory = useMemo(
		() => categories.find(({ isRefined }) => isRefined)?.value,
		[categories]
	);

	const plugins = useMemo(() => {
		const recentSearches = createLocalStorageRecentSearchesPlugin<MyRecentSearchItem>({
			key: 'instantsearch',
			limit: 3,
			transformSource({ source }) {
				return {
					...source,
					onSelect({ item }) {
						setInstantSearchUiState({
							query: item.label,
							category: item.category,
							geography: item.geography,
							name: item.name,
							subject: item.subject,
						});
					},
				};
			},
		});
		const querySuggestionsInCategory = createQuerySuggestionsPlugin({
			searchClient,
			indexName: INSTANT_SEARCH_QUERY_SUGGESTIONS,
			getSearchParams() {
				return recentSearches.data!.getAlgoliaSearchParams({
					hitsPerPage: 3,
					facetFilters: [
						`${INSTANT_SEARCH_INDEX_NAME}.facets.exact_matches.${INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTES[0]}.value:${currentCategory}`,
					],
				});
			},
			transformSource({ source }) {
				return {
					...source,
					sourceId: 'querySuggestionsInCategoryPlugin',
					onSelect({ item }) {
						setInstantSearchUiState({
							query: item.query,
							category: item.__autocomplete_qsCategory,

						});
					},
					getItems(params) {
						if (!currentCategory) {
							return [];
						}

						return source.getItems(params);
					},
					templates: {
						...source.templates,
						header({ items }) {
							if (items.length === 0) {
								return <Fragment />;
							}

							return (
								<Fragment>
                  <span className="aa-SourceHeaderTitle">
                    In {currentCategory}
                  </span>
									<span className="aa-SourceHeaderLine" />
								</Fragment>
							);
						},
					},
				};
			},
		});

		const querySuggestions = createQuerySuggestionsPlugin({
			searchClient,
			indexName: INSTANT_SEARCH_QUERY_SUGGESTIONS,
			getSearchParams() {
				if (!currentCategory) {
					return recentSearches.data!.getAlgoliaSearchParams({
						hitsPerPage: 6,
					});
				}

				return recentSearches.data!.getAlgoliaSearchParams({
					hitsPerPage: 3,
					facetFilters: [
						`${INSTANT_SEARCH_INDEX_NAME}.facets.exact_matches.${INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTES[0]}.value:-${currentCategory}`,
					],
				});
			},
			categoryAttribute: [
				INSTANT_SEARCH_INDEX_NAME,
				'facets',
				'exact_matches',
				INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTES[0],
			],
			transformSource({ source }) {
				return {
					...source,
					sourceId: 'querySuggestionsPlugin',
					onSelect({ item }) {
						setInstantSearchUiState({
							query: item.query,
							category: item.__autocomplete_qsCategory || '',

						});
					},
					getItems(params) {
						if (!params.state.query) {
							return [];
						}

						return source.getItems(params);
					},
					templates: {
						...source.templates,
						header({ items }) {
							if (!currentCategory || items.length === 0) {
								return <Fragment />;
							}

							return (
								<Fragment>
                  <span className="aa-SourceHeaderTitle">
                    In other categories
                  </span>
									<span className="aa-SourceHeaderLine" />
								</Fragment>
							);
						},
					},
				};
			},
		});

		return [recentSearches, querySuggestionsInCategory, querySuggestions];
	}, [currentCategory]);

	useEffect(() => {
		if (!autocompleteContainer.current) {
			return;
		}

		const autocompleteInstance = autocomplete({
			...autocompleteProps,
			container: autocompleteContainer.current,
			initialState: { query },
			insights: true,
			plugins,
			getSources({ query }) {
				if (!query) return [];

				return [
					{
						sourceId: 'geographyCategories',
						getItems() {
							return getAlgoliaFacets({
								searchClient,
								queries: [
									{
										indexName: 'Dev_Kaplan',
										facet: 'geography.name',
										params: { facetQuery: query, maxFacetHits: 5 },
									},
								],
							});
						},
						templates: {
							header() {
								return (
									<Fragment>
										<span className="aa-SourceHeaderTitle">Geography</span>
										<div className="aa-SourceHeaderLine" />
									</Fragment>
								);
							},
							item({ item }) {
								return (
									<a
										href={`/geography/${slugify(item.label)}`}
										className="block py-1 hover:underline"
									>
										{item.label}
									</a>
								);
							},
						},
					},
					{
						sourceId: 'subjectCategories',
						getItems() {
							return getAlgoliaFacets({
								searchClient,
								queries: [
									{
										indexName: 'Dev_Kaplan',
										facet: 'subject',
										params: { facetQuery: query, maxFacetHits: 5 },
									},
								],
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
										href={`/subject/${slugify(item.label)}`}
										className="block py-1 hover:underline"
									>
										{item.label}
									</a>
								);
							},
						},
					},
					{
						sourceId: 'nameCategories',
						getItems() {
							return getAlgoliaFacets({
								searchClient,
								queries: [
									{
										indexName: 'Dev_Kaplan',
										facet: 'name',
										params: { facetQuery: query, maxFacetHits: 5 },
									},
								],
							});
						},
						templates: {
							header() {
								return (
									<Fragment>
										<span className="aa-SourceHeaderTitle">Name</span>
										<div className="aa-SourceHeaderLine" />
									</Fragment>
								);
							},
							item({ item }) {
								return (
									<a
										href={`/name/${slugify(item.label)}`}
										className="block py-1 hover:underline"
									>
										{item.label}
									</a>
								);
							},
						},
					},
				];
			},
			onReset() {
				setInstantSearchUiState({ query: '', category: currentCategory });
			},
			onSubmit({ state }) {
				setInstantSearchUiState({ query: state.query });
			},
			onStateChange({ prevState, state }) {
				if (prevState.query !== state.query) {
					debouncedSetInstantSearchUiState({
						query: state.query,
					});
				}
			},
			renderer: { createElement, Fragment, render: () => {} },
			render({ children }, root) {
				if (!panelRootRef.current || rootRef.current !== root) {
					rootRef.current = root;

					panelRootRef.current?.unmount();
					panelRootRef.current = createRoot(root);
				}

				panelRootRef.current.render(children);
			},
		});

		return () => autocompleteInstance.destroy();
	}, [plugins]);

	return <div className={className} ref={autocompleteContainer} />;
}