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
import { simple } from 'instantsearch.js/es/lib/stateMappings'
import { useSearchParams } from 'react-router-dom'


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
	stateMapping: {
		stateToRoute(uiState) {
			const indexUiState = uiState['Dev_Kaplan'] || {}

			const normalizeValue = (value) =>
				value
					.toLowerCase()
					.replace(/ > /g, '_')
					.replace(/\//g, '_')
					.replace(/,/g, '_')
					.replace(/&/g, 'and') // Replace `&` with "and"
					.replace(/ /g, '_') // Replace spaces with underscores
					.replace(/[()]/g, '')
					.replace(/[^a-z0-9_,|]/g, ''); // Remove unwanted characters

			const formatList = (list) =>
				list ? list.map(normalizeValue).join(',') : ''

			const formatHierarchicalCategories = (hierarchicalMenu) =>
				Object.values(hierarchicalMenu || {})
					.flatMap((value) =>
						Array.isArray(value) ? value.map(normalizeValue) : [normalizeValue(value)]
					)
					.join(normalizeValue('/'))

			// Remove empty states
			const removeEmpty = (state) =>
				Object.fromEntries(
					Object.entries(state).filter(([_, value]) => value && value !== '')
				)

			return removeEmpty({
				query: indexUiState.query || '',
				page: indexUiState.page || '',
				hierarchicalCategories: formatHierarchicalCategories(indexUiState.hierarchicalMenu),
				geography: formatList(indexUiState.refinementList?.geography),
				language: formatList(indexUiState.refinementList?.language),
				name: (indexUiState.refinementList?.name),
				topic: formatList(indexUiState.refinementList?.topic)
			});
		},
		routeToState(routeState) {
			const parseList = (list) =>
				list ? list.split(',').map((item) => item.replace(/_/g, ' ')) : []

			return {
				Dev_Kaplan: {
					query: routeState.query || '',
					page: parseInt(routeState.page, 10) || 1,
					refinementList: {
						topic: parseList(routeState.topic),
						geography: parseList(routeState.geography),
						language: parseList(routeState.language),
						name: parseList(routeState.name)
					},
					hierarchicalMenu: routeState.hierarchicalCategories
						? {
							'hierarchicalCategories.lvl0': parseList(routeState.hierarchicalCategories)
						}
						: {}
				},
			};
		},
	},
	createURL({ qsModule, routeState, location }) {
		const baseUrl = location.href.split('?')[0]

		// Filter out empty parameters
		const filteredRouteState = Object.fromEntries(
			Object.entries(routeState).filter(([_, value]) => value && value !== '')
		)

		// Create the query string
		const queryString = qsModule.stringify(filteredRouteState, {
			addQueryPrefix: true,
			arrayFormat: 'comma'
		})

		// Return clean base URL if query string is empty
		return queryString ? `${baseUrl}${queryString}` : `${baseUrl}/search`
	}
};

function App() {

	return (

		<InstantSearch
			searchClient={searchClient}
			indexName="Dev_Kaplan"
			routing={routing}
			insights={true}
			future={{
				preserveSharedStateOnUnmount: true
			}}
		>


		<div className="bg-white mb-[100px]">
				<div>
					{/* Main content */}
					<main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						{/* Header Section */}
						<div className="bg-white border-gray-200 grid   grid-cols-3 md:grid-cols-4   py-4 items-center">
							<div className="    ">
								<h1 className="text-xl font-serif md:text-2xl font-bold text-gray-900">Discover</h1>
							</div>
							<div className="md:w-full md:col-span-3">
								<CustomSearchBox />
							</div>
							<div className="flex justify-end ">
								<MobileFilters />
							</div>
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
									<CustomRefinementList showSearch={true} showMore={true} limit={5} label="Geography"
																				attribute="geography" />
									<CustomRefinementList label="Collection" attribute="collection" />

									<CustomRefinementList label="Language" limit={4} showMore={true} attribute="language" />

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
											<CustomPagination />
										</div>

									</NoResultsBoundary>

									{/* Pagination */}

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


