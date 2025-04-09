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
		.replace(/\s+/g, "-")       // Replace spaces with dashes
		.replace(/[^\w\-]+/g, "")    // Remove all non-word characters except dashes
		.replace(/\-\-+/g, "-")      // Replace multiple dashes with a single dash
		.replace(/^-+/, "")          // Trim dashes from the start
		.replace(/-+$/, "");         // Trim dashes from the end
};

const routing = {
	router: history({
		parseURL({ location, qsModule }: { location: Location; qsModule: typeof qs }): RouteState {
			const pathname = location.pathname.replace(/^\/search\/?/, "");
			const parts = pathname.split("/");
			const state: RouteState = {
				query: parts[0] || "",
				page: [],
				topic: [],
				collection: [],
				language: [],
				geography: [],
				name: [],
				subcollection: [],
				hierarchicalCategories: []
			};

			for (let i = 1; i < parts.length; i += 2) {
				const key = parts[i] as keyof RouteState;
				const value = decodeURIComponent(parts[i + 1] || "");
				if (key === "dateRange") {
					const [min, max] = value.split(",").map(Number);
					if (!isNaN(min) && !isNaN(max)) {
						state.dateRange = { min, max };
					}
				} else if (key in state) {
					(state as any)[key] = value.split(",");
				}
			}
			return state;
		},

		createURL({ routeState, qsModule, location }: {
			routeState: RouteState;
			qsModule: typeof qs;
			location: Location
		}): string {
			let path = "/search";
			if (routeState.query) {
				path += "/" + slugifyFilterValue(routeState.query);
			}
			if (routeState.topic && routeState.topic.length > 0) {
				path += "/topic/" + routeState.topic.map(slugifyFilterValue).join(",");
			}
			if (routeState.collection && routeState.collection.length > 0) {
				path += "/collection/" + routeState.collection.map(slugifyFilterValue).join(",");
			}
			if (routeState.language && routeState.language.length > 0) {
				path += "/language/" + routeState.language.map(slugifyFilterValue).join(",");
			}
			if (routeState.subcollection && routeState.subcollection.length > 0) {
				path += "/subcollection/" + routeState.subcollection.map(slugifyFilterValue).join(",");
			}
			if (routeState.geography && routeState.geography.length > 0) {
				path += "/geography/" + routeState.geography.map(slugifyFilterValue).join(",");
			}
			if (routeState.name && routeState.name.length > 0) {
				path += "/name/" + routeState.name.map(slugifyFilterValue).join(",");
			}
			if (routeState.hierarchicalCategories && routeState.hierarchicalCategories.length > 0) {
				path += "/" + routeState.hierarchicalCategories.map(slugifyFilterValue).join("/");
			}
			if (routeState.dateRange) {
				path += "/dateRange/" + `${routeState.dateRange.min},${routeState.dateRange.max}`;
			}
			return path;
		}
	}),

	stateMapping: {
		stateToRoute(uiState: UiState) {
			const indexUiState = uiState[indexName] || {};

			// Extract geography from the refinement list under 'geography.name'
			const geography = indexUiState.refinementList?.["geography.name"] || [];


			let parsedDateRange: { min: number; max: number } | undefined;
			const dr = indexUiState.range?.startDate1;
			if (dr && typeof dr !== "string" && dr !== null && typeof dr === "object" && "min" in dr && "max" in dr) {
				parsedDateRange = {
					min: Number((dr as any).min),
					max: Number((dr as any).max)
				};
			}

			return {
				query: indexUiState.query || "",
				page: indexUiState.page,
				topic: indexUiState.refinementList?.topic || [],
				collection: indexUiState.refinementList?.collection || [],
				language: indexUiState.refinementList?.language || [],
				name: indexUiState.refinementList?.name || [],
				geography: geography,
				subcollection: indexUiState.refinementList?.subcollection || [],
				hierarchicalCategories: indexUiState.hierarchicalMenu?.["hierarchicalCategories.lvl0"],

				dateRange: parsedDateRange
			};
		},

		routeToState(routeState) {
			// Rebuild the hierarchicalMenu object from the array in routeState

			return {
				[indexName]: {
					query: routeState.query || "",
					page: routeState.page,
					hierarchicalMenu: {
						categories: routeState.hierarchicalCategories || []
					},
					refinementList: {
						topic: routeState.topic || [],
						collection: routeState.collection || [],
						language: routeState.language || [],
						subcollection: routeState.subcollection || [],
						"geography.name": routeState.geography || [],
						name: routeState.name || []
					},
					...(routeState.dateRange
						? {
							range: {
								startDate1: {
									min: routeState.dateRange.min,
									max: routeState.dateRange.max
								}
							}
						}
						: {})
				}
			};
		}
	}
};
const App = () => {

	return (
		<InstantSearch
			searchClient={searchClient}
			indexName={indexName}
			routing={routing}
			insights
			future={{ preserveSharedStateOnUnmount: true }}
		>
			<Configure filters='collection:"Arnold and Deanne Kaplan Collection of Early American Judaica"' />
			<VirtualFilters />
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