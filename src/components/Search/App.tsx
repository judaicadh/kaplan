import { algoliasearch } from 'algoliasearch'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {

	Configure,
	CurrentRefinements,
	InstantSearch,
	Stats,
	useClearRefinements, useCurrentRefinements,
	useHits,
	useHitsPerPage,
	useInstantSearch,
	usePagination,
	useRefinementList,
	useSearchBox,
	useSortBy,
	useToggleRefinement
} from 'react-instantsearch'

import { createBrowserHistory } from 'history'
import CustomGeoSearch from '@components/Search/MapComponent.tsx'
import DateRangeSlider from '@components/Search/DateRangeSlider.tsx'
import { Hit } from '@components/Search/Hit'
import type { CustomHitType } from '../../types/CustomHitType.ts'
import '../../styles/App/App.css'
import '../../styles/App/Theme.css'
import '../../styles/App/App.mobile.css'

import 'leaflet/dist/leaflet.css'
import { NoResultsBoundary } from '@components/Search/NoResultsBoundary.tsx'
import { NoResults } from '@components/Search/NoResults.tsx'

import {
	faSearch,
	faAngleDoubleLeft,
	faAngleDoubleRight,
	faAngleLeft,
	faAngleRight,
	faTimes, faFilter
} from '@fortawesome/free-solid-svg-icons'
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ClearFilters } from '@components/Search/ClearFilters.tsx'


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

const history = createBrowserHistory()

function createURL(routeState) {
	const queryParameters: Record<string, string> = {}
	if (routeState.q) {
		queryParameters.q = routeState.q // Only add `q` if it has a value
	}
	const queryString = new URLSearchParams(queryParameters).toString()

	return `${window.location.pathname}?${queryString}`
}

const stateMapping = {
	stateToRoute(uiState) {
		return {
			query: uiState.Dev_Kaplan?.query || '',
			page: uiState.Dev_Kaplan?.page || 1
			// Add other refinements as needed
		}
	},
	routeToState(routeState) {
		return {
			Dev_Kaplan: {
				query: routeState.query || '',
				page: routeState.page || 1
				// Add other refinements as needed
			}
		}
	}
}

function CustomCurrentRefinements(props) {
	const { items, canRefine, refine } = useCurrentRefinements(props)

	if (!canRefine) {
		return null // Hide if no refinements are applied
	}

	return (
		<div className="space-y-2">

			<ul className="space-y-1">
				{items.map((item) => (
					<li key={item.label} className="flex items-center space-x-2">

						{item.refinements.map((refinement) => (
							<button
								key={refinement.label}
								onClick={() => refine(refinement)}
								className="px-2 py-1 text-xs font-medium text-white bg-sky-600 rounded hover:bg-sky-500"
							>
								{refinement.label} ✕
							</button>
						))}
					</li>
				))}
			</ul>
		</div>
	)
}

function CustomHitsPerPage(props) {
	const { items, refine, canRefine } = useHitsPerPage(props)

	return (
		<div className="hits-per-page-container">
			<label htmlFor="Hits Per Page"
						 className="block text-start mb-0.5 text-sm font-bold text-gray-700 dark:text-white"> Hits
				per page:
			</label>
			<select
				id="Hits Per Page"
				className="p-2 rounded border"
				onChange={(event) => refine(event.target.value)}
				disabled={!canRefine}
			>
				{items.map((item) => (
					<option
						key={item.value}
						value={item.value}
						selected={item.isRefined}
					>
						{item.label}
					</option>
				))}
			</select>
		</div>
	)
}

function CustomClearRefinements(props) {
	const { refine, canRefine } = useClearRefinements(props)

	// Only render the button if there are refinements to clear
	if (!canRefine) {
		return null
	}

	return (
		<button
			onClick={() => refine()}
			className="px-4 py-2 rounded-md font-medium bg-sky-600  text-white hover:bg-sky-700"
		>
			Clear All Filters
		</button>
	)
}

function CustomHits() {
	const { hits, sendEvent } = useHits<CustomHitType>() // Type assertion

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
			{hits.map((hit) => (
				<Hit key={hit.objectID} hit={hit} sendEvent={sendEvent} />
			))}
		</div>
	)
}

function CustomSortBy() {
	const { currentRefinement, options, refine } = useSortBy({
		items: [
			{ value: 'Dev_Kaplan', label: 'Relevance' },
			{ value: 'title_asc', label: 'Title Ascending' },
			{ value: 'title_desc', label: 'Title Descending' },
			{ value: 'date_asc', label: 'Date Ascending' },
			{ value: 'date_desc', label: 'Date Descending' },
			{ value: 'id_asc', label: 'ID Ascending' },
			{ value: 'id_desc', label: 'ID Descending' }
		]
		// Set your default option here
	})

	return (
		<div className="sort-by-container">
			<label htmlFor="Sort By" className="block text-start mb-0.5 text-sm font-bold text-gray-700 dark:text-white">Sort
				By</label>

			<select
				id="Sort By"
				onChange={(event) => refine(event.target.value)}
				value={currentRefinement}
				className="p-2 rounded border"
			>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	)
}

function CustomPagination(props) {
	const {
		pages,
		currentRefinement,
		nbPages,
		isFirstPage,
		isLastPage,
		refine,
		canRefine
	} = usePagination(props)

	if (nbPages <= 1 || !canRefine) return null // Hide pagination if there's only one page or it can't be refined

	return (

		<nav className="  flex justify-center mt-8 object-center" aria-label="Pagination">
			<ul className="inline-flex -space-x-px">
				{/* First Page Button */}
				<li>
					<button
						onClick={() => refine(0)}
						disabled={isFirstPage}
						className={`px-3 py-2 rounded-l-lg border ${
							isFirstPage ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-gray-100'
						}`}
					>
						<FontAwesomeIcon icon={faAngleDoubleLeft} />
					</button>
				</li>

				{/* Previous Page Button */}
				<li>
					<button
						onClick={() => refine(currentRefinement - 1)}
						disabled={isFirstPage}
						className={`px-3 py-2 border ${
							isFirstPage ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-gray-100'
						}`}
					>
						<FontAwesomeIcon icon={faAngleLeft} />
					</button>
				</li>

				{/* Page Number Buttons */}
				{pages.map((page) => (
					<li key={page}>
						<button
							onClick={() => refine(page)}
							className={`px-3 py-2 border ${
								page === currentRefinement ? 'bg-sky-600 text-white' : 'text-sky-600 hover:bg-gray-100'
							}`}
						>
							{page + 1}
						</button>
					</li>
				))}

				{/* Next Page Button */}
				<li>
					<button
						onClick={() => refine(currentRefinement + 1)}
						disabled={isLastPage}
						className={`px-3 py-2 border ${
							isLastPage ? 'text-gray-400 cursor-not-allowed' : 'text-sky-600 hover:bg-gray-100'
						}`}
					>
						<FontAwesomeIcon icon={faAngleRight} />
					</button>
				</li>

				{/* Last Page Button */}
				<li>
					<button
						onClick={() => refine(nbPages - 1)}
						disabled={isLastPage}
						className={`px-3 py-2 rounded-r-lg border ${
							isLastPage ? 'text-gray-700 cursor-not-allowed' : 'text-sky-600 hover:bg-gray-100'
						}`}
					>
						<FontAwesomeIcon icon={faAngleDoubleRight} />
					</button>
				</li>
			</ul>
		</nav>

	)
}

function MobileFilters() {
	// State to control the visibility of the filter menu
	const [isFilterOpen, setIsFilterOpen] = useState(false)

	// Function to open and close the filter menu
	const toggleFilterMenu = () => setIsFilterOpen(!isFilterOpen)

	return (
		<div>
			{/* Button to open the filter menu */}
			<button
				onClick={toggleFilterMenu}
				className="md:hidden text-gray-700 bg-sky-700 p-2 rounded-full focus:outline-none hover:bg-blue-600"
				aria-label="Open Filters"
			>
				<FontAwesomeIcon icon={faFilter} className="text-white text-xl" />
			</button>

			{/* Filter menu, displayed only when isFilterOpen is true */}
			{isFilterOpen && (
				<div className="relative z-40 lg:hidden" role="dialog" aria-modal="true">
					{/* Background overlay */}
					<div
						className="fixed inset-0 bg-black/25"
						aria-hidden="true"
						onClick={toggleFilterMenu} // Click outside to close
					></div>

					<div className="fixed inset-0 z-40 flex">
						{/* Off-canvas menu */}
						<div
							className="relative ml-auto flex w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
							<div className="flex items-center justify-between px-4">
								<h2 className="text-lg font-medium text-gray-900">Filters</h2>
								<button
									type="button"
									onClick={toggleFilterMenu} // Close the menu when clicked
									className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
								>
									<span className="sr-only">Close menu</span>
									<svg
										className="h-6 w-6"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.5}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>
							<form className="mt-4 border-t border-gray-200">

								<div className="px-4 py-6">
									<CustomRefinementList attribute="type" label="Type" key="type" />
								</div>

								<hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />


								<div className="p-5 m-5">

									<DateRangeSlider
										title="Date"
										dateFields={[
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
										]}
										minTimestamp={-15135361438} // Example start date in your data range
										maxTimestamp={-631151999} // Example end date in your data range

									/>
								</div>

								<hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />


								<MapContainer
									style={{ height: '500px' }}
									center={[48.85, 2.35]}
									zoom={10}
								>
									<TileLayer
										attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
										url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
									/>
								</MapContainer>
								<hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
									<div className="pt-5  ">
										<CustomToggleRefinement attribute="hasRealThumbnail" label="Only show items that have images" />

									</div>

							</form>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

function CustomRefinementList({ attribute, label }) {
	const [isSearchVisible, setIsSearchVisible] = useState(false)

	const {
		items,
		canToggleShowMore,
		isShowingMore,
		toggleShowMore,
		searchForItems,
		refine
	} = useRefinementList({ attribute, showMore: true, sortBy: ['count:desc', 'name:asc'] })

	const toggleSearch = () => setIsSearchVisible(!isSearchVisible)

	return (
		<div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
	<span className="flex items-center justify-between mb-3">
	<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{label}</h3>

		{/* Search Icon */}
		<button
			type="button"
			onClick={toggleSearch}
			className="p-2 text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
			aria-label={`Search by ${label}`}
		>
		<FontAwesomeIcon icon={faSearch} />
	</button>
</span>
			{/* Conditionally render search input */}
			{isSearchVisible && (
				<div className="mt-3">
					<input
						type="search"
						onChange={(event) => searchForItems(event.currentTarget.value)}
						placeholder={`Search by ${label}`}
						className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
			)}

			{/* Items List */}
			<ul className="space-y-2 mt-3">
				{items.map((item) => (
					<li key={item.label} className="flex items-center">
						<input
							type="checkbox"
							checked={item.isRefined}
							onChange={() => refine(item.value)}
							className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
						/>
						<label
							onClick={() => refine(item.value)}
							className="ml-2 cursor-pointer text-gray-700 dark:text-gray-300 text-sm"
						>
							{item.label} <span className="text-gray-500">({item.count})</span>
						</label>
					</li>
				))}
			</ul>

			{/* Show More Button */}
			{canToggleShowMore && (
				<button
					type="button"
					onClick={toggleShowMore}
					className="mt-3 w-full p-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md dark:bg-gray-700 dark:text-blue-400 dark:hover:bg-gray-600"
					aria-expanded={isShowingMore}
				>
					{isShowingMore ? 'Show Less' : 'Show More'}
				</button>
			)}
		</div>
	)
}

function CustomSearchBox(props) {
	const { query, refine } = useSearchBox(props)
	const { status } = useInstantSearch()
	const [inputValue, setInputValue] = useState(query)
	const [isInputVisible, setIsInputVisible] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)

	const isSearchStalled = status === 'stalled'

	function setQuery(newQuery: string) {
		setInputValue(newQuery)
		refine(newQuery)
	}

	function toggleSearchInput() {
		setIsInputVisible(!isInputVisible)
		if (!isInputVisible && inputRef.current) {
			inputRef.current.focus()
		}
	}

	return (
		<div className="flex items-center space-x-2 border border-gray-300 rounded-md p-2 bg-white dark:bg-gray-800">
			{/* Search Icon as Toggle Button */}
			<button
				onClick={toggleSearchInput}
				className="text-gray-400"
				aria-label="Open search input"
			>
				<FontAwesomeIcon icon={faSearch} />
			</button>

			{/* Conditionally Render Search Form */}
			{isInputVisible && (
				<form
					action=""
					role="search"
					noValidate
					onSubmit={(event) => {
						event.preventDefault()
						event.stopPropagation()
						if (inputRef.current) {
							inputRef.current.blur()
						}
					}}
					onReset={(event) => {
						event.preventDefault()
						event.stopPropagation()
						setQuery('')
						if (inputRef.current) {
							inputRef.current.focus()
						}
					}}
					className="flex-3 flex items-center space-x-2"
				>
					<input
						ref={inputRef}

						placeholder="Search for Rebecca Gratz, trade card, Portland, OR..."
						spellCheck={false}

						type="search"
						value={inputValue}
						onChange={(event) => {
							setQuery(event.currentTarget.value)
						}}
						autoFocus
						className="w-full h-10 p-4 text-lg bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-sky-500"
					/>

					<span hidden={!isSearchStalled}>Searching…</span>
				</form>
			)}
		</div>
	)
}

function CustomToggleRefinement({ attribute, label }) {
	const { value, canRefine, refine } = useToggleRefinement({ attribute })
	return (
		<div className={`flex items-center space-x-3  ${!canRefine && 'opacity-50 cursor-not-allowed'}`}>
			{/* Toggle Switch */}
			<label className=" relative inline-flex items-center cursor-pointer space-x-2">
				<input
					type="checkbox"
					checked={value.isRefined}
					onChange={event => refine({ isRefined: !event.target.checked })}
					disabled={!canRefine}
					className="sr-only"
				/>

				<div
					className={`w-11 h-6 rounded-full border-sky-600 border-2 transition-colors duration-300 ${
						value.isRefined ? 'bg-sky-600' : 'bg-gray-300'
					}`}
				>
					<div
						className={`w-5 h-5 absolute top-0.5 bg-white rounded-full transition-transform duration-300 transform ${
							value.isRefined ? 'translate-x-5' : ''
						}`}
					></div>
				</div>
			</label>

			{/* Label and Counts */}
			<div className="flex flex-col text-gray-900 dark:text-gray-300">
				<span className="text-sm font-medium">{label}</span>
				<span className="text-xs text-gray-500">
          {value.isRefined ? `${value.onFacetValue.count} results` : `${value.offFacetValue.count} results`}
        </span>
			</div>
		</div>
	)
}




function App() {


	return (


		<InstantSearch searchClient={searchClient} indexName="Dev_Kaplan" routing={true} insights={true}>
			<div className="bg-white">
				<div>

					{/* Main content */}
					<main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

						<div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">

							<h1 className="text-4xl font-bold tracking-tight text-gray-900">Search Results</h1>
							<MobileFilters />
							<CustomSearchBox />


						</div>

						<section aria-labelledby="products-heading" className="pb-24 pt-6">
							<h2 id="products-heading" className="sr-only">Filter</h2>
							<span className="flex items-center justify-between mb-3">
							<Stats />

									<CustomCurrentRefinements />

							</span>

							<div className=" grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">

								{/* Desktop Filters */}
								<form
									className="hidden lg:block sticky top-8"> {/* Adjust `top-8` if you want more or less offset from the top */}
									<CustomClearRefinements />

									<CustomRefinementList attribute="type" label="Type" />
									<div className="border-b border-gray-200 py-6">
										<CustomRefinementList attribute="collection" label="Collection" />
									</div>
									<div className="border-b border-gray-200 py-6">

										<CustomGeoSearch />

									</div>
									<div className="border-b border-gray-200 py-6">
										<CustomToggleRefinement attribute="hasRealThumbnail" label="Only show items that have images" />
									</div>

									<div className="border-b border-gray-200 py-6">
										<DateRangeSlider
											title="Date"
											dateFields={[
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
											]}
											minTimestamp={-15135361438} // Example start date in your data range
											maxTimestamp={-631151999} // Example end date in your data range
										/>
									</div>
								</form>

								{/* Product grid */}
								<div className="lg:col-span-3">
									<span className="flex items-center justify-between mb-2">

										<CustomSortBy />
											<CustomHitsPerPage items={[
												{ label: '20 hits per page', value: 20, default: true },
												{ label: '40 hits per page', value: 40 },
												{ label: '80 hits per page', value: 80 }
											]} />

									</span>
									<NoResultsBoundary fallback={<NoResults />}>
										<CustomHits />
									</NoResultsBoundary>


									{/* Hits */}

									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
										{/* Render hits here or use a custom hit component */}
									</div>
								</div>
							</div>

							<CustomPagination />

						</section>
					</main>
				</div>
			</div>
		</InstantSearch>


	)
}


export default App