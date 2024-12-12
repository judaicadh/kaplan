import React, { useState } from 'react'
import { useRefinementList } from 'react-instantsearch'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'

function CustomRefinementList({
																attribute,
																label,
																limit = 10,
																showSearch = false,
																showMore = false,
																showMoreLimit = 20,
																accordionOpen = false // Control the initial state of the accordion
															}) {
	const [isSearchVisible, setIsSearchVisible] = useState(showSearch)

	const {
		items,
		canToggleShowMore,
		isShowingMore,
		toggleShowMore,
		searchForItems,
		refine,
		createURL, // To generate URLs for specific refinements
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
		<div className="w-full px-4">
			{/* Accordion Header */}
			<Disclosure defaultOpen={accordionOpen}>
				{({ open }) => (
					<>
						<DisclosureButton
							className="flex w-full justify-between items-center py-3 text-left text-gray-900 dark:text-gray-100 font-medium border-b border-gray-200 dark:border-gray-700">
							<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{label}</h3>
							{open ? (
								<ChevronUpIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
							) : (
								<ChevronDownIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
							)}
						</DisclosureButton>

						<DisclosurePanel className="pt-3">
							{/* Search Input */}
							{isSearchVisible && (
								<div className="mb-3">
									<input
										type="search"
										onChange={(event) => {
											searchForItems(event.currentTarget.value)
											sendEvent('view', event.currentTarget.value, 'Search')
										}}
										placeholder={`Search ${label}`}
										className="w-full p-2  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
									/>
								</div>
							)}

							{/* Items List */}
							<ul className="space-y-2">
								{items.map((item) => (
									<li key={item.label} className="flex items-center">
										<input
											type="checkbox"
											checked={item.isRefined}
											onChange={() => {
												refine(item.value) // Pass `item.value` to refine
												sendEvent('click', item.label, 'Refinement Selected') // Pass `item.label` or `item.value`
											}}
											className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
										/>
										<label
											onClick={(event) => {
												event.preventDefault()
												refine(item.value) // Pass `item.value` to refine
												sendEvent('click', item.label, 'Refinement Selected') // Pass `item.label` or `item.value`
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
						</DisclosurePanel>
					</>
				)}
			</Disclosure>
		</div>
	);
}

export default CustomRefinementList