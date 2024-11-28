import { useState } from 'react'
import { useRefinementList } from 'react-instantsearch'

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

export default CustomRefinementList