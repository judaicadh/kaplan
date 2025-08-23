import { algoliasearch } from 'algoliasearch'

import {
	Configure,
	InstantSearch,
	RefinementList,
	Stats
} from 'react-instantsearch'

import DateRangeSlider from '@components/Search/DateRangeSlider.tsx'
import '../../styles/App/App.css'
import '../../styles/App/Theme.css'
import '../../styles/App/App.mobile.css'
import qs from "qs";
import { NoResultsBoundary } from '@components/Search/NoResultsBoundary.tsx'
import { NoResults } from '@components/Search/NoResults.tsx'
import CustomHierarchicalMenu from '@components/Search/CustomHierarchicalMenu.tsx'
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
import { useMemo, useState, useEffect } from "react";
import VirtualFilters from '@components/Search/VirtualFilters.tsx'
import DefaultCollectionBanner from "@components/Misc/DefaultCollectionBanner.tsx";
import { Autocomplete } from "@components/Search/Autocomplete.tsx";

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
		.normalize("NFD")              // separate accents
		.replace(/[\u0300-\u036f]/g, "") // remove diacritics
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

function slugify(str: string): string {
	return str
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "") // strip accents
		.replace(/[^\w\s-]/g, "") // remove punctuation
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-")
		.replace(/--+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function deslugify(slug: string): string {
	return slug
		.replace(/-/g, " ")
		.replace(/\band\b/g, "&")
		.replace(/\b\w/g, l => l.toUpperCase());
}

function slugifyName(str: string): string {
	return str
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "") // remove diacritics
		.replace(/&/g, "__amp__")
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9.-]+/g, "") // strip anything not a-z, 0-9, dot, or dash
		.replace(/--+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function deslugifyName(slug: string): string {
	return slug
		.replace(/\bamp\b/g, "&")
		.replace(/-/g, " ")
		.replace(/\b\w/g, (l) => l.toUpperCase());
}

function deslugifyCollection(slug: string): string {
	if (slug === "arnold-and-deanne-kaplan-collection-of-early-american-judaica") {
		return "Arnold and Deanne Kaplan Collection of Early American Judaica";
	}
	if (slug === "arnold-and-deanne-kaplan-collection-of-modern-american-judaica") {
		return "Arnold and Deanne Kaplan Collection of Modern American Judaica";
	}
	if (slug === "out-of-scope-collection") {
		return "Out of Scope Collection";
	}
	return deslugify(slug); // fallback
}
const subcollectionSlugMap: Record<string, string> = {
	"gouvea-brandao-and-pantoja-archive": "Gouvea, Brandão, and Pantoja Archive",
	"isaac-leeser-archive": "Isaac Leeser Archive",
	"tobias-family-archive": "Tobias Family Archive",
	"aaron-hart-estate-archive": "Aaron Hart Estate Archive",
	"kaufman-oppenheimer-co-archive": "Kaufman Oppenheimer & Co. Archive",
	"willy-lindwer-suriname-collection": "Willy Lindwer Suriname Collection",
	"jacob-steinheimer-family-archive": "Jacob Steinheimer Family Archive",
	"cohen-oil-archive": "Cohen Oil Archive",
	"lord-john-simon-archive": "Lord John Son Archive"

	// Add other known slugs and labels as needed
};
const subcollectionLabelMap: Record<string, string> = Object.fromEntries(
	Object.entries(subcollectionSlugMap).map(([slug, label]) => [label, slug])
);
// Normalizes query param values into arrays
function normalizeToArray(value: any) {
	if (Array.isArray(value)) return value;
	if (value == null) return [];
	return [value];
}

const defaultCollection = "Arnold and Deanne Kaplan Collection of Early American Judaica";

const routing = {
	router: history({
		// Customize the window title using hierarchicalCategories.
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
			// Extract the base URL before /search
			const urlParts = location.href.match(/^(.*?)\/search/);
			const baseUrl = `${urlParts ? urlParts[1] : ""}/`;

			// Use the hierarchicalCategories array to build the category path.
			const categories: string[] = routeState.hierarchicalCategories || [];
			const categoryPath = categories.length
				? `${categories.map(getCategorySlug).join("/")}/`
				: "";

			const queryParameters: Record<string, any> = {};
			if (routeState.query) {
				queryParameters.query = encodeURIComponent(routeState.query);
			}
			if (routeState.page && routeState.page !== 1) {
				queryParameters.page = routeState.page;
			}
			if (routeState.topic && routeState.topic.length) {
				queryParameters.topic = routeState.topic.map(slugify);
			}
			if (routeState.language && routeState.language.length) {
				queryParameters.language = routeState.language.map(slugify);
			}
			if (routeState.collection && routeState.collection.length) {
				queryParameters.collection = routeState.collection.map(slugify);
			}
			if (routeState.subcollection && routeState.subcollection.length) {
				queryParameters.subcollection = routeState.subcollection.map(slugify);
			}
			if (routeState.name && routeState.name.length) {
				queryParameters.name = routeState.name.map(slugifyName); // ✅ already slugified, don't double-encode
			}
			if (routeState.geography && routeState.geography.length) {
				queryParameters.geography = routeState.geography.map(slugify);
			}
			console.log("Routing to Algolia with name:", routeState.name);
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
			// Extract hierarchical categories from the path.
			const pathnameMatches = location.pathname.match(/search\/(.*?)\/?$/);
			const categoryPath = (pathnameMatches && pathnameMatches[1]) || "";
			const hierarchicalCategories = categoryPath
				? categoryPath.split("/").filter(Boolean).map(getCategoryName)
				: [];

			// Destructure query parameters.
			const {
				query = "",
				page,
				topic = [],
				language = [],
				subcollection = [],
				name = [],
				geography = [],
				collection = []
			} = qsModule.parse(location.search.slice(1), { ignoreQueryPrefix: true });

			// Ensure we have arrays.
			const allTopics = normalizeToArray(topic).map(decodeURIComponent).map(deslugify);
			const allCollections = normalizeToArray(collection)
				.map(decodeURIComponent)
				.map(deslugifyCollection);
			const allLanguages = normalizeToArray(language).map(decodeURIComponent).map(deslugify);
			const allSubcollections = normalizeToArray(subcollection)
				.map(decodeURIComponent)
				.map(slug => subcollectionSlugMap[slug] || deslugify(slug));
			const allNames = normalizeToArray(name)
				.map(decodeURIComponent)
				.map(deslugifyName);
			const allGeography = normalizeToArray(geography).map(decodeURIComponent).map(deslugify);
			console.log("Parsed name refinements:", allNames);
			return {
				query: decodeURIComponent(query),
				page,
				topic: allTopics.map(decodeURIComponent),
				collection: allCollections,
				language: allLanguages.map(decodeURIComponent),
				subcollection: allSubcollections,
				name: allNames.map(decodeURIComponent),				// Map the URL key "geography" to the internal attribute "geography.name"
				geography: allGeography.map(decodeURIComponent).map(deslugify),
				hierarchicalCategories
			};
		},
	}),

	stateMapping: {
		// Converts InstantSearch's internal state into a simple route state.
		stateToRoute(uiState: any) {
			const indexUiState = uiState[indexName] || {};

			return {
				query: indexUiState.query,
				page: indexUiState.page,
				// Extract the hierarchicalCategories array from the internal state.
				hierarchicalCategories:
					indexUiState.hierarchicalMenu?.["hierarchicalCategories.lvl0"] || [],
				topic: indexUiState.refinementList?.topic || [],
				language: indexUiState.refinementList?.language || [],
				collection: indexUiState.refinementList?.collection || [],
				subcollection: (indexUiState.refinementList?.subcollection || []).map(
					label => slugifyFilterValue(subcollectionLabelMap[label] || label)
				),
				name: indexUiState.refinementList?.name || [],
				geography: indexUiState.refinementList?.["geography.name"] || []
			};
		},

		// Converts the simple route state into InstantSearch's uiState.
		routeToState(routeState: any): any {
			const hasNoFilters =
				!routeState.query &&
				!routeState.topic?.length &&
				!routeState.language?.length &&
				!routeState.subcollection?.length &&
				!routeState.name?.length &&
				!routeState.geography?.length &&
				!routeState.collection?.length &&
				!routeState.hierarchicalCategories?.length;
			console.log("Refining subcollection:", routeState.subcollection);
			const defaultCollection = ["Arnold and Deanne Kaplan Collection of Early American Judaica"];

			return {
				[indexName]: {
					query: routeState.query,
					page: routeState.page,
					hierarchicalMenu: {
						"hierarchicalCategories.lvl0": routeState.hierarchicalCategories || []
					},
					refinementList: {
						topic: routeState.topic || [],
						collection: hasNoFilters ? defaultCollection : (routeState.collection || []),
						language: routeState.language || [],
						subcollection: routeState.subcollection || [],
						name: routeState.name || [],
						// Map the URL key "geography" to the internal attribute "geography.name"
						"geography.name": routeState.geography || [],
					},
				},
			};
		},
	},
};

function isEmptySearch(): boolean {
	if (typeof window === "undefined") return false;

	const params = new URLSearchParams(window.location.search);

	const keysToCheck = ["query", "topic", "language", "collection", "subcollection", "name", "geography"];
	return keysToCheck.every(key => !params.get(key) && !params.getAll(key).length);
}
const App = () => {
	if (typeof window !== "undefined" && window.location.search.includes("redirect=true")) {
		const url = new URLSearchParams(window.location.search).get("path");
		if (url) {
			window.history.replaceState(null, "", decodeURIComponent(url));
		}
	}
	const [resetKey, setResetKey] = useState(Date.now());

	const [dateFilterActive, setDateFilterActive] = useState(false);
	const [dateRange, setDateRange] = useState<{ min: number; max: number } | undefined>(undefined);
	const handleReset = () => {
		setResetKey(Date.now());
		setDateFilterActive(false);
		setDateRange(undefined); // ✅ clear date range when clearing all filters
	};

	const showDefaultCollectionBanner = isEmptySearch();
	return (
		<InstantSearch
			searchClient={searchClient}
			indexName={indexName}
			routing={routing}
			insights

			future={{ preserveSharedStateOnUnmount: true }}
		>
			<div className="bg-white dark:bg-gray-900 min-h-screen mb-[100px]">
				<main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 overflow-x-hidden">
					<div
						className="bg-gradent-to-r from-gray-100 via-white to-gray-100 dark:from-gray-800 dark:to-gray-900 py-6 px-4 md:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-700 rounded-b-2xl shadow-sm grid grid-cols-1 md:grid-cols-4 items-center gap-4">

						<h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">Discover</h1>
						<div className="md:col-span-3 xs:col-span-1">
							<div className="flex items-center justify-between gap-4 flex-wrap">
								<div className="flex-grow">
									<CustomSearchBox onResetQuery={handleReset} />
								</div>
								<MobileFilters
									resetKey={resetKey}
									onResetDateSlider={handleReset}
									dateFilterActive={dateFilterActive}
									setDateFilterActive={setDateFilterActive}
									dateRange={dateRange}
									setDateRange={setDateRange}
								/>
							</div>
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
					<DefaultCollectionBanner />
					<section aria-labelledby="products-heading" className="bg-white pt-6">
						<h2 id="products-heading" className="sr-only">Filters</h2>
						<div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
							<aside className="col-span-1 bg-white lg:block hidden md:visible top-3 space-y-6 ">
								{/*<CustomClearRefinements />*/}
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
									key={resetKey}
									title="Date"
									dateFields={dateFields}
									minTimestamp={-15135361438}
									maxTimestamp={-631151999}
									value={dateRange} // <- controlled value
									onChange={(newValue) => {
										setDateRange(newValue);
										setDateFilterActive(true);
									}}
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
								<CustomRefinementList label="Subcollections" attribute="subcollection" />

								<CustomToggleRefinement
									attribute="hasRealThumbnail"
									label="Only show items with images"
								/>
							</aside>
							<div className="md:col-span-3 sm:col-span-1 space-y-6">
								<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
									{/* Left block: Stats and Clear Filters */}
									<div className="flex flex-wrap items-center gap-2">
										<Stats />
										<CustomClearRefinements
											onResetDateSlider={handleReset}
											dateFilterActive={dateFilterActive}
											dateRange={dateRange}
											setDateRange={setDateRange}
											defaultDateRange={{ min: -15135361438, max: -631151999 }} // 👈 must match your slider
										/>
									</div>

									{/* Right block: Sort and Hits per Page */}
									<div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
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