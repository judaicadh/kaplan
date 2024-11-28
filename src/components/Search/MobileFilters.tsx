import { useState } from 'react'
import DateRangeSlider from '@components/Search/DateRangeSlider.tsx'
import CustomToggleRefinement from '@components/Search/CustomToggleRefinement.tsx'
import CustomRefinementList from '@components/Search/CustomRefinementList.tsx'
import CustomHierarchicalMenu from '@components/Search/HierarchicalMenu.tsx'

function MobileFilters() {
	const [isFilterOpen, setIsFilterOpen] = useState(false)

	const toggleFilterMenu = () => setIsFilterOpen(!isFilterOpen)

	return (
		<div>

			<button
				onClick={toggleFilterMenu}
				type="button"
				aria-label="Toggle Filter"
				className=" md:hidden flex  justify-end  items-center  rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto"
			>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
						 className="size-6">
					<path strokeLinecap="round" strokeLinejoin="round"
								d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
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

					<div className="fixed inset-0 z-40 flex overflow-scroll">
						<div className="relative ml-auto flex w-full max-w-xs flex-col   bg-white py-4 pb-12 shadow-xl">
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

									<CustomHierarchicalMenu
										showMore={true}
										attributes={['hierarchicalCategories.lvl0', 'hierarchicalCategories.lvl1', 'hierarchicalCategories.lvl2']}
									/>
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
								<CustomRefinementList label="Collection" attribute="collection" />
								<CustomRefinementList label="Language" attribute="language" />
								<CustomRefinementList label="Archival Collection" attribute="subcollection" />
							</form>

						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default MobileFilters