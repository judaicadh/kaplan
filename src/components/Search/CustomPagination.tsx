import { usePagination, type UsePaginationProps } from 'react-instantsearch';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'

library.add(faAngleLeft, faAngleRight, faAngleDoubleLeft, faAngleDoubleRight)

declare global {
	interface Window { dataLayer?: any[] }
}

type CustomPaginationProps = UsePaginationProps & {
	/** Optional: push a GTM event when page changes */
	gtmEventName?: string; // e.g., "algolia_page_changed"
};

function CustomPagination(props: CustomPaginationProps)  {
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

	const goTo = (page: number, source: string) => {
		// clamp into valid range
		const next = Math.max(0, Math.min(page, nbPages - 1));
		if (next === currentRefinement) return;
		refine(next);

		if (props.gtmEventName) {
			window.dataLayer?.push({
				event: props.gtmEventName,
				algolia: {
					page: next + 1,
					totalPages: nbPages,
					source, // "first" | "prev" | "number" | "next" | "last"
				},
			});
		}
	};

	return (

		<nav className="flex justify-center mt-8 object-center" aria-label="Pagination">
			<ul className="inline-flex -space-x-px">
				{/* First Page Button */}
				<li>
					<button
						type="button"
						onClick={() => goTo(0, 'first')}
						disabled={isFirstPage}
						aria-label="Go to first page"
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
						type="button"
						onClick={() => goTo(currentRefinement - 1, 'prev')}
						disabled={isFirstPage}
						aria-label="Go to previous page"
						className={`px-3 py-2 border ${
							isFirstPage ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-gray-100'
						}`}
					>
						<FontAwesomeIcon icon={faAngleLeft} />
					</button>
				</li>

				{pages.map((page) => {
					const isCurrent = page === currentRefinement;
					return (
						<li key={page}>
							<button
								type="button"
								onClick={() => goTo(page, 'number')}
								aria-label={`Go to page ${page + 1}`}
								aria-current={isCurrent ? 'page' : undefined}
								className={`px-3 py-2 border ${
									isCurrent ? 'bg-white text-gray-800 font-semibold ' : 'text-teal-600 hover:bg-gray-100'
								}`}
							>
								{page + 1}
							</button>
						</li>
					);
				})}


				{/* Next Page Button */}
				<li>
					<button
						type="button"
						onClick={() => goTo(currentRefinement + 1, 'next')}
						disabled={isLastPage}
						aria-label="Go to next page"
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
						type="button"
						onClick={() => goTo(nbPages - 1, 'last')}
						disabled={isLastPage}
						aria-label="Go to last page"
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