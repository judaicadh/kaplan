import { algoliasearch } from 'algoliasearch'
import L from 'leaflet'
import {
	Configure,
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
import { history } from 'instantsearch.js/es/lib/routers'
import { useMemo, useState } from 'react'
import VirtualFilters from '@components/Search/VirtualFilters.tsx'

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

const routing = {
	router: history(),
	windowTitle({ hierarchicalCategories, query }) {
		const queryTitle = query ? `Results for "${query}"` : 'Search'

		if (hierarchicalCategories) {
			return `${hierarchicalCategories} – ${queryTitle}`
		}

		return queryTitle
	},
	stateMapping: {
		stateToRoute(uiState) {
			const indexUiState = uiState[indexName]
			console.log('stateToRoute - uiState:', uiState)
			console.log('stateToRoute - indexUiState:', indexUiState)


			return {
				q: indexUiState.query,
				hierarchicalCategories: indexUiState.hierarchicalMenu?.['hierarchicalCategories.lvl0'],
				name: indexUiState.refinementList?.name,
				topic: indexUiState.refinementList?.topic,
				subcollection: indexUiState.refinementList?.subcollection,
				collection: indexUiState.refinementList?.collection,
				language: indexUiState.refinementList?.language,
				'geographic_subject.name': indexUiState.refinementList?.['geographic_subject.name'],
				page: indexUiState.page,
				sortBy: indexUiState.sortBy,
				filterBy: indexUiState.filterBy
			}
		},
		routeToState(routeState) {
			return {
				[indexName]: {
					query: routeState.q,
					menu: {
						'hierarchicalCategories.lvl0': routeState.hierarchicalCategories
					},
					refinementList: {
						collection: routeState.collection,
						language: routeState.language,
						name: routeState.name,
						topic: routeState.topic,
						subcollection: routeState.subcollection,
						'geographic_subject.name': routeState['geographic_subject.name']

					},
					page: routeState.page
				},
			};
		},
	},
};

const App = () => {
	const initialUiState = useMemo(() => {
		const searchParams = new URLSearchParams(window.location.search)
		const uiStateFromUrl = searchParams.get('uiState')
		return uiStateFromUrl ? JSON.parse(uiStateFromUrl) : {}
	}, [])

	return (
		<InstantSearch
			searchClient={searchClient}
			indexName={indexName}
			routing={routing}
			insights
			initialUiState={initialUiState}
			future={{ preserveSharedStateOnUnmount: true }}
		>
			<VirtualFilters />
			<div className="bg-white dark:bg-gray-900 min-h-screen mb-[100px]">
				<main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					{/* Header Section */}
					<div
						className="bg-white dark:bg-gray-800 py-4 border-b border-gray-200 dark:border-gray-700 grid grid-cols-3 md:grid-cols-4 items-center">
						<h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">Discover</h1>
						{/* Search Box */}
						<div className="md:col-span-3 xs:col-span-1">
							<CustomSearchBox />
						</div>
						{/* Mobile Filters Button */}
						<div className="col-span-1 flex justify-end">
							<MobileFilters />
						</div>
					</div>

					{/* Breadcrumb and Filters */}
					<div className="flex flex-col sm:flex-row justify-between items-center my-4 space-y-4 sm:space-y-0">
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
							<div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
								{/* Desktop Filters */}
								<aside
									className="col-span-1 bg-white lg:block hidden md:visible top-3 space-y-6 border-r border-b  ">

									<CustomClearRefinements />

									<CustomHierarchicalMenu
										showMore={false}
										title="Form"
										attributes={['hierarchicalCategories.lvl0', 'hierarchicalCategories.lvl1', 'hierarchicalCategories.lvl2']}
									/>

									<CustomRefinementList accordionOpen={true} showMore={false} showSearch={false} limit={5} label="Topic"
																				attribute="topic" />


									<DateRangeSlider
										title="Date"

										dateFields={dateFields}
										minTimestamp={-15135361438}
										maxTimestamp={-631151999}

									/>


									<CustomRefinementList accordionOpen={false} showMore={true} showSearch={true} limit={5} label="Name"
																				attribute="name" />
									<CustomRefinementList accordionOpen={false} showSearch={true} showMore={true} limit={5}
																				label="Geography"
																				attribute={'geographic_subject.name'} />
									<CustomRefinementList label="Collection" attribute="collection" />

									<CustomRefinementList label="Language" limit={4} showMore={true} attribute="language" />

									<CustomRefinementList label="Archival Collection" attribute="subcollection" />


									<CustomToggleRefinement attribute="hasRealThumbnail" label="Only show items with images" />
								</aside>


								{/* Results and Sorting */}

								{/* Stats, Sort, and Hits Per Page */}
								<div className="md:col-span-3 sm:col-span-1 space-y-6">
									{/* Stats, Sort, and Hits Per Page */}
									<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
										{/* Stats */}
										<Stats />

										{/* SortBy and HitsPerPage */}
										<div className="flex items-center space-x-4">
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

									{/* Hits Section */}
									<NoResultsBoundary fallback={<NoResults />}>
										<div className=" sm:grid-cols-1   lg:grid-cols-3  ">
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


