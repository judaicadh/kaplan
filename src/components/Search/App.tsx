import { algoliasearch } from 'algoliasearch'
import L from 'leaflet'
import { history } from 'instantsearch.js/es/lib/routers'
import qs from 'qs' // Assuming you're using 'qs' for query string handling.

import {
	DynamicWidgets,

	InstantSearch,
	Stats
} from 'react-instantsearch'

import DateRangeSlider from '@components/Search/DateRangeSlider.tsx'
import '../../styles/App/App.css'
import '../../styles/App/Theme.css'
import '../../styles/App/App.mobile.css'

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
import type { UiState } from 'instantsearch.js'

const customIcon = new L.DivIcon({
	html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="40" height="47">
      <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/>
    </svg>`,
	className: 'custom-icon', // Optional, for custom styling
	iconSize: [40, 47], // Set the size of your icon
	iconAnchor: [20, 47], // Align the bottom of the icon
	popupAnchor: [0, -47] // Position the popup above the icon
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


function getCategorySlug(name: string): string {
	return name
		.split(' ')
		.map(encodeURIComponent)
		.join('+')
}

// Converts a slug back to a category name.
function getCategoryName(slug: string): string {
	return slug
		.split('+')
		.map(decodeURIComponent)
		.join(' ')
}

interface RouteState {
	query?: string;
	page?: number;
	language?: string[];
	collection?: string[];
	date?: string[];
	hierarchicalCategories?: string;
	topic?: string[];
	genres?: string;
	name?: string[];
	start?: string;
	end?: string;
}

const routing = {
	router: history({
		windowTitle({ hierarchicalCategories, query }: RouteState) {
			const queryTitle = query ? `Results for "${query}"` : 'Search'

			if (hierarchicalCategories) {
				return `${hierarchicalCategories} – ${queryTitle}`
			}

			return queryTitle
		},

		createURL({ qsModule, routeState, location }) {
			const baseUrl = `${location.origin}/search/`

			const categoryPath = routeState.hierarchicalCategories
				? `${getCategorySlug(routeState.hierarchicalCategories)}/`
				: ''

			const queryParameters: Record<string, any> = {}

			if (routeState.query) queryParameters.query = routeState.query
			if (routeState.page && routeState.page !== 1) queryParameters.page = routeState.page
			if (routeState.topic) queryParameters.topic = routeState.topic.map(encodeURIComponent)
			if (routeState.collection) queryParameters.collection = routeState.collection.map(encodeURIComponent)
			if (routeState.genres) queryParameters.genres = encodeURIComponent(routeState.genres)
			if (routeState.language) queryParameters.language = routeState.language.map(encodeURIComponent)
			if (routeState.name) queryParameters.name = routeState.name.map(encodeURIComponent)
			if (routeState.dateFields) queryParameters.start = routeState.dateFields


			const queryString = qsModule.stringify(queryParameters, {
				addQueryPrefix: true,
				arrayFormat: 'repeat'
			})

			return `${baseUrl}${categoryPath}${queryString}`
		},
		parseURL({ qsModule, location }) {
			const pathnameMatches = location.pathname.match(/search\/(.*?)\/?$/)
			const hierarchicalCategories = pathnameMatches?.[1]
				? getCategoryName(pathnameMatches[1])
				: undefined

			const {
				query = '',
				page = '1',
				topic = [],
				genres = '',
				name = [],
				language = '',
				start = '',
				end = ''
			} = qsModule.parse(location.search.slice(1))

			const coerceToString = (value: any): string | undefined =>
				Array.isArray(value)
					? value[0]
					: typeof value === 'string'
						? value
						: undefined

			const allTopics = Array.isArray(topic)
				? topic.filter((t): t is string => typeof t === 'string')
				: [topic].filter((t): t is string => typeof t === 'string')

			return {
				query,
				page: Number(page),
				hierarchicalCategories,
				topic: allTopics,
				genres,
				language,
				start: coerceToString(start),
				end: coerceToString(end)
			}
		}
	}),
	stateMapping: {
		stateToRoute(uiState) {
			const indexUiState = uiState['Dev_Kaplan'] || {}

			return {
				query: indexUiState.query || '',
				page: indexUiState.page || 1,
				hierarchicalCategories: indexUiState.menu?.hierarchicalCategories || '',
				topic: indexUiState.refinementList?.topic || [],
				genres: indexUiState.hierarchicalMenu?.genres || '',
				language: indexUiState.refinementList?.language || '',
				start: indexUiState.range?.start || '',
				end: indexUiState.range?.end || ''
			}
		},

		routeToState(routeState) {
			return {
				Dev_Kaplan: {
					query: routeState.query,
					page: routeState.page,
					menu: {
						hierarchicalCategories: routeState.hierarchicalCategories
					},
					refinementList: {
						topic: routeState.topic,
						language: routeState.language
					},
					hierarchicalMenu: {
						genres: routeState.genres
					},
					range: {
						start: routeState.start,
						end: routeState.end
					}

				}
			}

		}
	}
}
function App() {


	return (
		<InstantSearch
			searchClient={searchClient}
			indexName="Dev_Kaplan"
			routing={routing}
			insights={true}
			future={{
				preserveSharedStateOnUnmount: true
			}}>
			<div className="bg-white">
				<div>
					{/* Main content */}
					<main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						{/* Header Section */}
						<div className="bg-white border-gray-200 grid grid-cols-4 md:grid-cols-4   py-4 items-center">
							<div className="col-span-1 items-center  ">
								<h1 className="text-xl md:text-2xl font-bold text-gray-900">Explore</h1>
							</div>
							<div className="md:col-span-3 xs:col-span-2 items-center  ">
								<CustomSearchBox />
							</div>
							<MobileFilters />
						</div>
						<div className="flex flex-col sm:flex-row pt-1 sm:justify-between sm:items-center space-y-4 sm:space-y-0">
							<CustomBreadcrumb
								attributes={[
									'hierarchicalCategories.lvl0',
									'hierarchicalCategories.lvl1',
									'hierarchicalCategories.lvl2'
								]}
							/>
						</div>
						{/* Filters and Content Section */}
						<section aria-labelledby="products-heading" className="bg-white pt-6">
							<h2 id="products-heading" className="sr-only">Filters</h2>
							<div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
								{/* Desktop Filters */}
								<aside
									className=" bg-white lg:block hidden md:visible top-3 space-y-6 border-r border-b  ">

									<CustomClearRefinements />

									<CustomHierarchicalMenu
										showMore={true}
										title="Type"
										attributes={['hierarchicalCategories.lvl0', 'hierarchicalCategories.lvl1', 'hierarchicalCategories.lvl2']}
									/>
									<hr />
									<CustomRefinementList showMore={false} showSearch={false} limit={5} label="Topic" attribute="topic" />

									<hr />
									<DateRangeSlider
										title="Date"

										dateFields={dateFields}
										minTimestamp={-15135361438}
										maxTimestamp={-631151999}

									/>

									<hr />
									<CustomRefinementList showMore={true} showSearch={true} limit={5} label="Name" attribute="name" />
									<hr />
									<CustomRefinementList label="Collection" attribute="collection" />
									<hr />
									<CustomRefinementList label="Language" limit={4} showMore={true} attribute="language" />
									<hr />
									<CustomRefinementList label="Archival Collection" attribute="subcollection" />


									<CustomToggleRefinement attribute="hasRealThumbnail" label="Only show items with images" />
								</aside>


								{/* Results and Sorting */}
								<div className="lg:col-span-3 space-y-6">
									{/* Stats, Sort, and Hits Per Page */}
									<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
										<Stats />
										<div className="flex flex-row-reverse">
											<CustomSortBy />
											<CustomHitsPerPage
												items={[
													{ label: '20 hits per page', value: 20, default: true },
													{ label: '40 hits per page', value: 40 },
													{ label: '80 hits per page', value: 80 }
												]}
											/>
										</div>

									</div>

									{/* Hits */}
									<NoResultsBoundary fallback={<NoResults />}>
										<div className="">
											<CustomHits />
										</div>
									</NoResultsBoundary>

									{/* Pagination */}
									<CustomPagination />
								</div>
							</div>
						</section>
					</main>
				</div>
			</div>
		</InstantSearch>
	)
}

export default App


