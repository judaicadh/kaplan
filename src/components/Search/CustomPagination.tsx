import { usePagination } from 'react-instantsearch'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'

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
								page === currentRefinement ? 'bg-white text-gray-800 font-semibold ' : 'text-teal-600 hover:bg-gray-100'
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
							isLastPage ? 'text-gray-400 cursor-not-allowed' : 'text-teal-600 hover:bg-gray-100'
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

export default CustomPagination