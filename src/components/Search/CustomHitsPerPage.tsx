import { useHitsPerPage } from 'react-instantsearch'
import { useState } from 'react'

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

export default CustomHitsPerPage