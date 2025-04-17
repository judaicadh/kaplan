import { useState, useEffect, useRef } from 'react'
import DateRangeSlider from '@components/Search/DateRangeSlider.tsx'
import CustomRefinementList from '@components/Search/CustomRefinementList.tsx'
import CustomHierarchicalMenu from "@components/Search/CustomHierarchicalMenu.tsx";
import { ClearFiltersMobile } from '@components/Search/ClearFiltersMobile.tsx'
import { ClearFilters } from '@components/Search/ClearFilters.tsx'
import CustomClearRefinements from '@components/Search/CustomClearRefinements.tsx'
function MobileFilters() {
	const [isFilterOpen, setIsFilterOpen] = useState(false)

	// Correctly type the refs
	const filterPanelRef = useRef<HTMLDivElement | null>(null)
	const toggleButtonRef = useRef<HTMLButtonElement | null>(null)

	const toggleFilterMenu = () => {
		setIsFilterOpen((prev) => !prev)
	};

	// Close panel on outside click
	useEffect(() => {
		const handleOutsideClick = (event: MouseEvent) => {
			const target = event.target as Node | null // Explicitly cast to Node

			if (
				filterPanelRef.current &&
				!filterPanelRef.current.contains(target) &&
				toggleButtonRef.current &&
				!toggleButtonRef.current.contains(target)
			) {
				setIsFilterOpen(false)
			}
		};

		document.addEventListener('mousedown', handleOutsideClick)

		return () => {
			document.removeEventListener('mousedown', handleOutsideClick)
		}
	}, []);


	const dateFields = [
		'startDate1',
		'endDate1',
		'startDate2',
		'endDate2'
		// Additional date fields
	]

	return (
		<>
			{/* Toggle Button */}
			<button
				ref={toggleButtonRef}
				onClick={toggleFilterMenu}
				type="button"
				aria-expanded={isFilterOpen}
				aria-controls="mobile-filter-panel"
				aria-label="Toggle filter menu"
				className="md:hidden flex justify-end rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					aria-label="filter menu"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="h-6 w-6"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
					/>
				</svg>
				<p className="sr-only">Filter</p>

			</button>

			{/* Filter Panel */}
			{isFilterOpen && (
				<div className="relative z-40 lg:hidden" role="dialog" aria-modal="true">
					{/* Overlay */}
					<div
						className="fixed inset-0 bg-black/25 transition-opacity"
						aria-hidden="true"
					></div>

					{/* Panel */}
					<div
						id="mobile-filter-panel"
						ref={filterPanelRef}
						className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col bg-white dark:bg-gray-800 py-4 pb-12 px-8 shadow-xl overflow-y-auto transition-transform transform translate-x-0"
					>
						<div className="flex items-center justify-between px-4">
							<h2 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h2>
							<button
								type="button"
								onClick={toggleFilterMenu}
								aria-label="Close filter menu"
								className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
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
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>

						<form
							className="border-t border-gray-200 dark:border-gray-700 space-y-6"
							role="form"

						>
							<CustomClearRefinements />
							<CustomHierarchicalMenu
								showMore={true}
								title="Categories"
								attributes={[
									'hierarchicalCategories.lvl0',
									'hierarchicalCategories.lvl1',
									'hierarchicalCategories.lvl2'
								]}
							/>
							<CustomRefinementList label="Topic" attribute="topic" showMore />
							<DateRangeSlider
								title="Date Range"
								dateFields={dateFields}
								minTimestamp={-15135361438}
								maxTimestamp={-631151999}
							/>
							<CustomRefinementList label="Name" attribute="name" showMore />
							<CustomRefinementList label="Collection" attribute="collection" />
							<CustomRefinementList label="Language" attribute="language" showMore />
							<CustomRefinementList label="Archival Collection" attribute="subcollection" />
						</form>
					</div>
				</div>
			)}
		</>
	);
}

export default MobileFilters