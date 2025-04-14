import { algoliasearch } from 'algoliasearch'
import L from 'leaflet'
import {
	Configure,
	InstantSearch,
	Stats
} from 'react-instantsearch'

import type { UiState } from "instantsearch.js";
import DateRangeSlider from '@components/Search/DateRangeSlider.tsx'
import '../../styles/App/App.css'
import '../../styles/App/Theme.css'
import '../../styles/App/App.mobile.css'
import qs from "qs";
import { NoResultsBoundary } from '@components/Search/NoResultsBoundary.tsx'
import { NoResults } from '@components/Search/NoResults.tsx'
import CustomHierarchicalMenu from '@components/Search/HierarchicalMenu.tsx'
import CustomToggleRefinement from '@components/Search/CustomToggleRefinement.tsx'
import CustomRefinementList from '@components/Search/CustomRefinementList.tsx'
import CustomSortBy from '@components/Search/CustomSortBy.tsx'
import CustomHitsPerPage from '@components/Search/CustomHitsPerPage.tsx'
import CustomClearRefinements from '@components/Search/CustomClearRefinements.tsx'
import CustomSearchBox from '@components/Search/CustomSearchBox.tsx'
import CustomHits from '@components/Search/CustomHits.tsx'
import CustomPagination from '@components/Search/CustomPagination.tsx'
import CustomBreadcrumb from '@components/Search/CustomBreadcrumb.tsx'
import MobileFilters from '@components/Search/MobileFilters.tsx'
import { history } from 'instantsearch.js/es/lib/routers'
import { useMemo } from "react";
import VirtualFilters from '@components/Search/VirtualFilters.tsx'

const customIcon = new L.DivIcon({
	html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="40" height="47">
      <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/>
    </svg>`,
	className: "custom-icon",
	iconSize: [40, 47],
	iconAnchor: [20, 47],
	popupAnchor: [0, -47]
})

const searchClient = algoliasearch('ZLPYTBTZ4R', 'be46d26dfdb299f9bee9146b63c99c77')
const indexName = 'Dev_Kaplan'
const dateFields = [
	'startDate1', 'endDate1',
	'startDate2', 'endDate2',
	'startDate3', 'endDate3',
	'startDate4', 'endDate4',
	'startDate5', 'endDate5',
	'startDate6', 'endDate6',
	'startDate7', 'endDate7',
	'startDate8', 'endDate8',
	'startDate9', 'endDate9',
	'startDate10', 'endDate10',
	'startDate11', 'endDate11'
]

// Define a RouteState that includes the desired properties
type RouteState = {
	query?: string;
	page?: number;
	topic?: string[];
	collection?: string[];
	language?: string[];
	subcollection?: string[];
	geography?: string[];
	name?: string[];
	hierarchicalCategories?: string[];
	dateRange?: {
		min: number;
		max: number;
	};
};

// A simple slugify function that replaces spaces with dashes and removes non-word characters.
const slugifyFilterValue = (str: string): string => {
	return str
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-")
		.replace(/[^\w\-]+/g, "")
		.replace(/\-\-+/g, "-")
		.replace(/^-+/, "")
		.replace(/-+$/, "");
};

function getCategorySlug(name: string = ""): string {
	return name ? name.split(" ")
		.map(encodeURIComponent)
		.join("+") : "";
}

function getCategoryName(slug: string) {
	return slug
		.split("+")
		.map(decodeURIComponent)
		.join(" ");
}

// Normalizes query param values into arrays
function normalizeToArray(value: any) {
	if (Array.isArray(value)) return value;
	if (value == null) return [];
	return [value];
}

const defaultCollection = "Arnold and Deanne Kaplan Collection of Early American Judaica";

const routing = {
	router: history({
		// Use the full array of hierarchical categories for the window title.
		windowTitle({
									hierarchicalCategories,
									query
								}: {
			hierarchicalCategories?: string[];
			query?: string;
		}) {
			const queryTitle = query ? `Results for "${query}"` : "Search";
			const categoryTitle =
				hierarchicalCategories && hierarchicalCategories.length
					? hierarchicalCategories.join(" / ")
					: "";
			return categoryTitle ? `${categoryTitle} – ${queryTitle}` : queryTitle;
		},

		createURL({
								qsModule,
								routeState,
								location
							}: {
			qsModule: any;
			routeState: any;
			location: Location;
		}) {
			// Extract the base URL before /search.
			const urlParts = location.href.match(/^(.*?)\/search/);
			const baseUrl = `${urlParts ? urlParts[1] : ""}/`;

			// Use the array "hierarchicalCategories" to build the path.
			const categories: string[] = routeState.hierarchicalCategories || [];
			const validCategories = categories.filter((c) => c); // remove undefined, null, or empty string.
			const categoryPath = validCategories.length
				? `${validCategories.map(getCategorySlug).join("/")}/`
				: "";

			const queryParameters: Record<string, any> = {};
			if (routeState.query) {
				queryParameters.query = encodeURIComponent(routeState.query);
			}
			if (routeState.page && routeState.page !== 1) {
				queryParameters.page = routeState.page;
			}
			if (routeState.topic && routeState.topic.length) {
				queryParameters.topic = routeState.topic.map(encodeURIComponent);
			}
			if (routeState.language && routeState.language.length) {
				queryParameters.language = routeState.language.map(encodeURIComponent);
			}
			if (routeState.collection && routeState.collection.length) {
				queryParameters.collection = routeState.collection.map(encodeURIComponent);
			}
			if (routeState.subcollection && routeState.subcollection.length) {
				queryParameters.subcollection = routeState.subcollection.map(encodeURIComponent);
			}
			if (routeState.name && routeState.name.length) {
				queryParameters.name = routeState.name.map(encodeURIComponent);
			}
			if (routeState.geography && routeState.geography.length) {
				queryParameters.geography = routeState.geography.map(encodeURIComponent);
			}
			const queryString = qsModule.stringify(queryParameters, {
				addQueryPrefix: true,
				arrayFormat: "repeat"
			});
			return `${baseUrl}search/${categoryPath}${queryString}`;
		},

		parseURL({
							 qsModule,
							 location
						 }: {
			qsModule: any;
			location: Location;
		}) {
			// Extract the category path from the URL.
			const pathnameMatches = location.pathname.match(/search\/(.*?)\/?$/);
			const categoryPath = pathnameMatches && pathnameMatches[1] ? pathnameMatches[1] : "";
			const hierarchicalCategories = categoryPath
				? categoryPath.split("/").filter(Boolean).map(getCategoryName)
				: [];

			const {
				query = "",
				page,
				topic = [],
				collection = [],
				language = [],
				subcollection = [],
				name = [],
				geography = []
			} = qsModule.parse(location.search.slice(1));

			const allTopics = Array.isArray(topic) ? topic : [topic].filter(Boolean);
			let allCollections = Array.isArray(collection) ? collection : [collection].filter(Boolean);
			if (!allCollections.length) {
				allCollections = [defaultCollection];
			}
			const allLanguages = Array.isArray(language) ? language : [language].filter(Boolean);
			const allSubcollections = Array.isArray(subcollection) ? subcollection : [subcollection].filter(Boolean);
			const allNames = Array.isArray(name) ? name : [name].filter(Boolean);
			const allGeography = Array.isArray(geography) ? geography : [geography].filter(Boolean);

			return {
				query: decodeURIComponent(query),
				page,
				topic: allTopics.map(decodeURIComponent),
				collection: allCollections.map(decodeURIComponent),
				language: allLanguages.map(decodeURIComponent),
				subcollection: allSubcollections.map(decodeURIComponent),
				name: allNames.map(decodeURIComponent),
				geography: allGeography.map(decodeURIComponent),
				hierarchicalCategories // Return the full multi-level array.
			};
		},
	}),

	stateMapping: {
		// Convert UI state into a simple route state.
		stateToRoute(uiState: any) {
			const indexUiState = uiState[indexName] || {};

			// Extract individual levels from the hierarchical menu.
			const lvl0 = indexUiState.hierarchicalMenu?.["hierarchicalCategories.lvl0"];
			const lvl1 = indexUiState.hierarchicalMenu?.["hierarchicalCategories.lvl1"];
			const lvl2 = indexUiState.hierarchicalMenu?.["hierarchicalCategories.lvl2"];

			// Build an array that includes the first value from each level if available.
			const hierarchicalCategories: string[] = [];
			if (lvl0 && lvl0[0]) hierarchicalCategories.push(lvl0[0]);
			if (lvl1 && lvl1[0]) hierarchicalCategories.push(lvl1[0]);
			if (lvl2 && lvl2[0]) hierarchicalCategories.push(lvl2[0]);

			const collectionFromState = indexUiState.refinementList?.collection || [];

			return {
				query: indexUiState.query,
				page: indexUiState.page,
				hierarchicalCategories, // Combined multi-level array.
				topic: indexUiState.refinementList?.topic || [],
				language: indexUiState.refinementList?.language || [],
				collection:
					collectionFromState.length === 1 && collectionFromState[0] === defaultCollection
						? []
						: collectionFromState,
				subcollection: indexUiState.refinementList?.subcollection || [],
				name: indexUiState.refinementList?.name || [],
				geography: indexUiState.refinementList?.["geography.name"] || []
			};
		},

		// Convert a simple route state back into UI state.
		routeToState(routeState: any): any {
			const cats: string[] = routeState.hierarchicalCategories || [];
			return {
				[indexName]: {
					query: routeState.query,
					page: routeState.page,
					// Map the route array back into hierarchicalMenu with separate keys.
					hierarchicalMenu: {
						"hierarchicalCategories.lvl0": cats[0] ? [cats[0]] : [],
						"hierarchicalCategories.lvl1": cats[1] ? [cats[1]] : [],
						"hierarchicalCategories.lvl2": cats[2] ? [cats[2]] : []
					},
					refinementList: {
						topic: routeState.topic || [],
						collection:
							routeState.collection && routeState.collection.length > 0
								? routeState.collection
								: [defaultCollection],
						language: routeState.language || [],
						subcollection: routeState.subcollection || [],
						name: routeState.name || [],
						"geography.name": routeState.geography || [],
					},
				},
			};
		},
	},
};

const App = () => {
	if (typeof window !== "undefined" && window.location.search.includes("redirect=true")) {
		const url = new URLSearchParams(window.location.search).get("path");
		if (url) {
			window.history.replaceState(null, "", decodeURIComponent(url));
		}
	}
	return (
		<InstantSearch
			searchClient={searchClient}
			indexName={indexName}
			routing={routing}
			insights
			future={{ preserveSharedStateOnUnmount: true }}
		>
			<div className="bg-white dark:bg-gray-900 min-h-screen mb-[100px]">
				<main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div
						className="bg-white dark:bg-gray-800 py-4 border-b border-gray-200 dark:border-gray-700 grid grid-cols-3 md:grid-cols-4 items-center">
						<h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">Discover</h1>
						<div className="md:col-span-3 xs:col-span-1">
							<CustomSearchBox />
						</div>
						<div className="col-span-1 flex justify-end md:hidden">
							<MobileFilters />
						</div>
					</div>
					<div className="flex flex-col sm:flex-row justify-between items-center my-4 space-y-4 sm:space-y-0">
						<CustomBreadcrumb
							attributes={[
								'hierarchicalCategories.lvl0',
								'hierarchicalCategories.lvl1',
								'hierarchicalCategories.lvl2'
							]}
						/>
					</div>
					<section aria-labelledby="products-heading" className="bg-white pt-6">
						<h2 id="products-heading" className="sr-only">Filters</h2>
						<div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
							<aside className="col-span-1 bg-white lg:block hidden md:visible top-3 space-y-6 border-r border-b">
								<CustomClearRefinements />
								<CustomHierarchicalMenu
									showMore={false}
									title="Form"
									attributes={[
										"hierarchicalCategories.lvl0",
										"hierarchicalCategories.lvl1",
										"hierarchicalCategories.lvl2"
									]}
								/>
								<CustomRefinementList
									accordionOpen={true}
									showMore={false}
									showSearch={false}
									limit={5}
									label="Topic"
									attribute="topic"
								/>
								<DateRangeSlider
									title="Date"
									dateFields={dateFields}
									minTimestamp={-15135361438}
									maxTimestamp={-631151999}
								/>
								<CustomRefinementList
									accordionOpen={false}
									showMore={true}
									showSearch={true}
									limit={5}
									label="Name"
									attribute="name"
								/>
								<CustomRefinementList
									accordionOpen={false}
									showSearch={true}
									showMore={true}
									limit={5}
									label="Geography"
									attribute={"geography.name"}
								/>
								<CustomRefinementList label="Collection" attribute="collection" />
								<CustomRefinementList
									label="Language"
									limit={4}
									showMore={true}
									attribute="language"
								/>
								<CustomRefinementList label="Archival Collection" attribute="subcollection" />
								<CustomToggleRefinement
									attribute="hasRealThumbnail"
									label="Only show items with images"
								/>
							</aside>
							<div className="md:col-span-3 sm:col-span-1 space-y-6">
								<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
									<Stats />
									<div className="flex items-center space-x-4">
										<CustomSortBy />
										<CustomHitsPerPage
											items={[
												{ label: "20 hits per page", value: 20, default: true },
												{ label: "40 hits per page", value: 40 },
												{ label: "80 hits per page", value: 80 }
											]}
										/>
									</div>
								</div>
								<NoResultsBoundary fallback={<NoResults />}>
									<div className="sm:grid-cols-1 lg:grid-cols-3">
										<CustomHits />
									</div>
									<CustomPagination />
								</NoResultsBoundary>
							</div>
						</div>
					</section>
				</main>
			</div>
		</InstantSearch>
	)
}

export default App