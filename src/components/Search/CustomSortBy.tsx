import { useSortBy } from 'react-instantsearch'
import { useState } from 'react'

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

export default CustomSortBy