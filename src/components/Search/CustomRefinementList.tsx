import React, { useState } from 'react'
import { useRefinementList } from 'react-instantsearch'

function CustomRefinementList({
																attribute,
																label,
																limit = 10,
																showSearch = false,
																showMore = false,
																showMoreLimit = 20
															}) {
	const [isSearchVisible, setIsSearchVisible] = useState(showSearch)

	const {
		items,
		canToggleShowMore,
		isShowingMore,
		toggleShowMore,
		searchForItems,
		refine,
		sendEvent
	} = useRefinementList({
		attribute,
		limit,
		showMore,
		showMoreLimit,
		sortBy: ['count:desc', 'name:asc']
	});

	const toggleSearch = () => setIsSearchVisible(!isSearchVisible)

	return (
		<div className="p-4 pt-0 bg-white dark:bg-gray-800 rounded-lg ">
			{/* Header with Label and Search Toggle */}
			<div className="flex items-center justify-between mb-3">
				<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{label}</h3>
				{showSearch && (
					<button
						type="button"
						onClick={toggleSearch}
						aria-expanded={isSearchVisible}
						className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none dark:text-gray-300 dark:hover:text-gray-100"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 512 512"
							className="w-5 h-5"
						>
							<path
								d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
						</svg>
						<span className="sr-only">
              {isSearchVisible ? 'Hide Search' : 'Search'}
            </span>
					</button>
				)}
			</div>

			{/* Conditionally Render Search Input */}
			{isSearchVisible && (
				<div className="mt-3">
					<input
						type="search"
						onChange={(event) => {
							searchForItems(event.currentTarget.value)
							sendEvent('view', event.currentTarget.value, 'Search')
						}}
						placeholder={`Search ${label}`}
						className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
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
							onChange={() => {
								refine(item.value)
								sendEvent('click', item, 'Refinement Selected')
							}}
							className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
						/>
						<label
							onClick={(event) => {
								event.preventDefault()
								refine(item.value)
								sendEvent('click', item, 'Refinement Selected')
							}}
							className="ml-2 cursor-pointer text-gray-700 dark:text-gray-300 text-sm"
						>
							{item.label} <span className="text-gray-500">({item.count})</span>
						</label>
					</li>
				))}
			</ul>

			{/* Show More Button */}
			{showMore && canToggleShowMore && (
				<button
					type="button"
					onClick={() => {
						toggleShowMore()
						sendEvent('click', isShowingMore ? 'Show Less' : 'Show More')
					}}
					className="mt-3 w-full p-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md dark:bg-gray-700 dark:text-blue-400 dark:hover:bg-gray-600"
					aria-expanded={isShowingMore}
				>
					{isShowingMore ? 'Show Less' : 'Show More'}
				</button>
			)}
		</div>
	);
}

export default CustomRefinementList