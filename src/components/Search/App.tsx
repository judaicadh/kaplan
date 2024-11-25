import { algoliasearch } from 'algoliasearch'
import React, { useRef, useState } from 'react'
import { history } from 'instantsearch.js/es/lib/routers'

import L from 'leaflet'
import {
	Breadcrumb,
	InstantSearch, RefinementList,
	Stats, useBreadcrumb,
	useClearRefinements,
	useCurrentRefinements,
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
	faAngleDoubleLeft,
	faAngleDoubleRight,
	faAngleLeft,
	faAngleRight,
	faFilterCircleXmark,
	faSearch
} from '@fortawesome/free-solid-svg-icons'
import { MapContainer, TileLayer } from 'react-leaflet'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CustomHierarchicalMenu from '@components/Search/HierarchicalMenu.tsx'
import instantsearch from 'instantsearch.js'


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


function createURL(routeState) {
	const queryParameters: Record<string, string> = {}
	if (routeState.q) queryParameters.q = routeState.q
	if (routeState.page) queryParameters.page = String(routeState.page)
	if (routeState.collection) queryParameters.collection = routeState.collection.join(',')
	if (routeState.language) queryParameters.language = routeState.language.join(',')

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
];
function CustomCurrentRefinements(props) {
	const { items, canRefine, refine } = useCurrentRefinements(props)

	if (!canRefine) {
		return null // Hide if no refinements are applied
	}

	return (
		<div className="sm:hidden md:flex">

			<ul className="space-y-1">
				{items.map((item) => (
					<li key={item.label} className="flex items-center space-x-2">  {item.refinements.map((refinement) => (
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

function CustomBreadcrumb({ attributes }: { attributes: string[] }) {
	const { items, canRefine, refine, createURL } = useBreadcrumb({ attributes })

	if (!canRefine || items.length === 0) {
		return null // Do not render breadcrumbs if there's nothing to refine
	}

	return (

		<nav
			className="flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
			aria-label="Breadcrumb">
			<ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
				{items.map((item, index) => (
					<li key={item.label} className="inline-flex items-center">
						{/* Render the separator for all but the first breadcrumb */}
						{index > 0 && (
							<svg
								className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 6 10"
							>
								<path
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M1 9L5 5 1 1"
								/>
							</svg>
						)}
						<a
							href={createURL(item.value)}
							className={`${
								(item as any).isRefined
									? 'text-blue-600 font-medium'
									: 'text-sm font-medium text-gray-700 hover:text-blue-600'
							}`}
							onClick={(event) => {
								event.preventDefault()
								refine(item.value)
							}}
						>
							{item.label}
						</a>
					</li>
				))}
			</ol>
		</nav>
	)
}

function CustomHitsPerPage(props) {
	const { items, refine, canRefine } = useHitsPerPage(props)
	const [isOpen, setIsOpen] = useState(false)

	const toggleDropdown = () => {
		setIsOpen((prev) => !prev)
	}

	return (
		<div className="relative hits-per-page-container">
			<button
				id="hitsPerPageButton"
				onClick={toggleDropdown}
				type="button"
				className="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto"
				disabled={!canRefine}
			>
				Hits per page
				<svg
					className="-me-0.5 ms-2 h-4 w-4"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					fill="none"
					viewBox="0 0 24 24"
				>
					<path
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="m19 9-7 7-7-7"
					/>
				</svg>
			</button>

			{isOpen && (
				<ul
					className="absolute z-10 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800"
					onClick={() => setIsOpen(false)}
				>
					{items.map((item) => (
						<li
							key={item.value}
							className={`block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 hover:text-primary-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
								item.isRefined ? 'font-bold' : ''
							}`}
							onClick={() => {
								refine(item.value)
								setIsOpen(false)
							}}
						>
							{item.label}
						</li>
					))}
				</ul>
			)}
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

		<button type="button"
						onClick={() => refine()}
						className=" float-right text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-2 focus:outline-none focus:ring-gray-300 rounded-lg text-xs px-2 py-2.5 text-center me-0  dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800">
			<FontAwesomeIcon icon={faFilterCircleXmark} className="pr-2" />
			Clear Filters
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

	const [isOpen, setIsOpen] = useState(false)

	const toggleDropdown = () => {
		setIsOpen((prev) => !prev)
	}

	return (
		<div className="relative sort-by-container">
			<button
				id="sortDropdownButton1"
				onClick={toggleDropdown}
				type="button"
				className="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto"
			>
				<svg
					className="-ms-0.5 me-2 h-4 w-4"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					fill="none"
					viewBox="0 0 24 24"
				>
					<path
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M7 4v16M7 4l3 3M7 4 4 7m9-3h6l-6 6h6m-6.5 10 3.5-7 3.5 7M14 18h4"
					/>
				</svg>
				Sort
				<svg
					className="-me-0.5 ms-2 h-4 w-4"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					fill="none"
					viewBox="0 0 24 24"
				>
					<path
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="m19 9-7 7-7-7"
					/>
				</svg>
			</button>

			{isOpen && (
				<ul
					className="absolute z-10 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800"
					onClick={() => setIsOpen(false)}
				>
					{options.map((option) => (
						<li
							key={option.value}
							className={`block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 hover:text-primary-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
								currentRefinement === option.value ? 'font-bold' : ''
							}`}
							onClick={() => refine(option.value)}
						>
							{option.label}
						</li>
					))}
				</ul>
			)}
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

		<nav className="flex justify-center mt-8 object-center" aria-label="Pagination">
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
	const [isFilterOpen, setIsFilterOpen] = useState(false)

	const toggleFilterMenu = () => setIsFilterOpen(!isFilterOpen)

	return (
		<div>

			<button
				onClick={toggleFilterMenu}
				type="button"
				className=" md:hidden flex w-full items-center justify-end rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto"
			>
				<svg
					className="-ms-0.5 me-2 h-4 w-4"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					fill="none"
					viewBox="0 0 24 24"
				>
					<path
						stroke="currentColor"
						strokeLinecap="round"
						strokeWidth="2"
						d="M18.796 4H5.204a1 1 0 0 0-.753 1.659l5.302 6.058a1 1 0 0 1 .247.659v4.874a.5.5 0 0 0 .2.4l3 2.25a.5.5 0 0 0 .8-.4v-7.124a1 1 0 0 1 .247-.659l5.302-6.059c.566-.646.106-1.658-.753-1.658Z"
					/>
				</svg>
				Filters
				<svg
					className="-me-0.5 ms-2 h-4 w-4"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					fill="none"
					viewBox="0 0 24 24"
				>
					<path
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="m19 9-7 7-7-7"
					/>
				</svg>
			</button>


			{isFilterOpen && (
				<div className="relative z-40 lg:hidden" role="dialog" aria-modal="true">

					<div
						className="fixed inset-0 bg-black/25"
						aria-hidden="true"
						onClick={toggleFilterMenu}
					></div>

					<div className="fixed inset-0 z-40 flex">
						<div
							className="relative ml-auto flex w-full max-w-xs flex-col sticky bg-white py-4 pb-12 shadow-xl">
							<div className="flex items-center justify-between px-4">
								<h2 className="text-lg font-medium text-gray-900">Filters</h2>
								<button
									type="button"
									onClick={toggleFilterMenu}
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
										minTimestamp={-15135361438}
										maxTimestamp={-631151999}
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
								<div className="pt-5">
									<CustomToggleRefinement
										attribute="hasRealThumbnail"
										label="Only show items that have images"
									/>
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
		<div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
	<span className="flex items-center justify-between mb-3">
	<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{label}</h3>

		{/* Search Icon */}
		{/*	<button
			type="button"
			onClick={toggleSearch}
			className="p-2 text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
			aria-label={`Search by ${label}`}
		>
		<FontAwesomeIcon icon={faSearch} />
	</button>*/}
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

	/*	function toggleSearchInput() {
			setIsInputVisible(!isInputVisible)
			if (!isInputVisible && inputRef.current) {
				inputRef.current.focus()
			}
		}*/

	return (


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
			className="col-span-2"
		>
			<label htmlFor="default-search"
						 className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
			<div className="relative">
				<div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
					<button
						// onClick={toggleSearchInput}
						className="text-gray-400"
						aria-label="Open search input"
					>
						<FontAwesomeIcon icon={faSearch} />
					</button>
				</div>
				<input
					ref={inputRef} placeholder="Search..."
					spellCheck={false} type="search"
					value={inputValue}
					onChange={(event) => {
						setQuery(event.currentTarget.value)
					}}
					autoFocus
					className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				/>

			</div>
		</form>


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
const routing = {
	router: history({
		writeDelay: 400,
		cleanUrlOnDispose: true,
		createURL({ qsModule, location, routeState }) {
			const { origin, pathname, hash } = location
			const indexState = routeState['instant_search'] || {}
			const queryString = qsModule.stringify(routeState)

			if (!indexState.query) {
				return `${origin}${pathname}${hash}`
			}

			return `${origin}${pathname}?${queryString}${hash}`
		},
	}),
};
function App() {


	return (
		<InstantSearch
			searchClient={searchClient}
			indexName="Dev_Kaplan"

			insights={true}>
			<div className="bg-white">
				<div>
					{/* Main content */}
					<main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						{/* Header Section */}
						<div className="border-b border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4 py-4 items-center">
							<h1 className="text-xl md:text-2xl font-bold text-gray-900">Explore</h1>
							<CustomSearchBox />

						</div>
						<div className="flex flex-col sm:flex-row pt-1 sm:justify-between sm:items-center space-y-4 sm:space-y-0">
							<CustomBreadcrumb
								attributes={[
									'categories.lvl0',
									'categories.lvl1',
									'categories.lvl2'
								]}
							/>
						</div>
						{/* Filters and Content Section */}
						<section aria-labelledby="products-heading" className="pb-24 pt-6">
							<h2 id="products-heading" className="sr-only">Filters</h2>
							<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
								{/* Desktop Filters */}
								<aside
									className=" lg:block   top-8 space-y-6 border-r pr-4 max-h-[calc(100vh-2rem)]  ">
									<CustomClearRefinements />

									<CustomHierarchicalMenu
										showMore={true}
										attributes={['categories.lvl0', 'categories.lvl1', 'categories.lvl2']}
									/>
									<CustomRefinementList label="Collection" attribute="collection" />
									<CustomRefinementList label="Language" attribute="language" />

									<DateRangeSlider
										title="Date"

										dateFields={dateFields}
										minTimestamp={-15135361438}
										maxTimestamp={-631151999}

									/>
									<CustomToggleRefinement attribute="hasRealThumbnail" label="Only show items with images" />
									<CustomRefinementList label="Name" attribute="name" />
								</aside>


								{/* Results and Sorting */}
								<div className="lg:col-span-3 space-y-6">
									{/* Stats, Sort, and Hits Per Page */}
									<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
										<Stats />
										<div className="flex space-x-4">
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