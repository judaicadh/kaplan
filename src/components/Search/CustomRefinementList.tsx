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
																accordionOpen = false
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
		sortBy: ['count:desc', 'name:asc'],
	});

	const toggleSearch = () => setIsSearchVisible(!isSearchVisible)

	return (
		<div className="w-full px-4">
			<Disclosure defaultOpen={accordionOpen}>
				{({ open }) => (
					<>
						<DisclosureButton className="flex w-full justify-between items-center py-3 text-left text-gray-900 dark:text-gray-100 font-medium border-b border-gray-200 dark:border-gray-700">
							<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{label}</h3>
							{open ? (
								<ChevronUpIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
							) : (
								<ChevronDownIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
							)}
						</DisclosureButton>

						<DisclosurePanel className="pt-3">
							{/* Facet search (optional) */}
							{isSearchVisible && (
								<div className="mb-3">
									<input
										type="search"
										onChange={(event) => {
											const q = event.currentTarget.value;
											searchForItems(q);
											// optional: tell GTM a facet-search happened
											window?.dataLayer?.push({
												event: 'Facet Search',
												facetAttribute: attribute,
												query: q
											});
										}}
										placeholder={`Search ${label}`}
										className="w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
									/>
								</div>
							)}

							{/* Items */}
							<ul className="space-y-0.5">
								{items.map((item) => (
									<li
										key={item.label}
										// ↓↓↓ This is what GTM reads
										data-insights-filter={`${attribute}:${item.value}`}
									>
										<label
											htmlFor={`${attribute}-${item.value}`}
											className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
										>
											<input
												id={`${attribute}-${item.value}`}
												type="checkbox"
												checked={item.isRefined}
												onChange={() => {
													refine(item.value);
													// ❌ sendEvent('click', item, 'Filter Clicked')
													sendEvent('click', item.value, 'Filter Clicked'); // ✅ expects a string
												}}
												className="h-5 w-5 shrink-0 rounded border-gray-300 text-blue-600 dark:border-gray-600 dark:bg-gray-700"
											/>
											<span className="flex-1">
												{item.label} <span className="text-gray-500">({item.count})</span>
											</span>
										</label>
									</li>
								))}
							</ul>

							{/* Show more */}
							{showMore && canToggleShowMore && (
								<button
									type="button"
									onClick={() => {
										toggleShowMore();
										window?.dataLayer?.push({
											event: 'Facet ShowMore Toggled',
											facetAttribute: attribute,
											expanded: !isShowingMore
										});
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