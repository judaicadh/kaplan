// @components/Search/MobileFilters.tsx
import { useState, useEffect, useMemo } from 'react';
import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	DialogTitle,
} from '@headlessui/react';
import { XMarkIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { useInstantSearch, useCurrentRefinements } from 'react-instantsearch';
import DateRangeSlider from '@components/Search/DateRangeSlider.tsx';
import CustomRefinementList from '@components/Search/CustomRefinementList.tsx';
import CustomHierarchicalMenu from '@components/Search/CustomHierarchicalMenu.tsx';
import CustomClearRefinements from '@components/Search/CustomClearRefinements.tsx';
import { formatNumber } from '../../utils';

type MobileFiltersProps = {
	resetKey: number;
	onResetDateSlider: () => void;
	dateFilterActive: boolean;
	setDateFilterActive: React.Dispatch<React.SetStateAction<boolean>>;
	dateRange: { min: number; max: number } | undefined;
	setDateRange: React.Dispatch<React.SetStateAction<{ min: number; max: number } | undefined>>;
};

// The default collection is applied automatically when the user hasn't
// chosen any filters, so it shouldn't be counted as an "active" filter.
const DEFAULT_COLLECTION =
	'Arnold and Deanne Kaplan Collection of Early American Judaica';

function MobileFilters({
												 resetKey,
												 dateFilterActive,
												 onResetDateSlider,
												 setDateFilterActive,
												 dateRange,
												 setDateRange,
											 }: MobileFiltersProps) {
	const [isFilterOpen, setIsFilterOpen] = useState(false);

	// Live result count so users can see the impact of their filters
	// without leaving the drawer.
	const {
		results: { nbHits },
	} = useInstantSearch();

	// Count the active refinements (excluding the auto-applied default
	// collection) plus the date range, to badge the trigger button.
	const { items: currentRefinements } = useCurrentRefinements();
	const activeFilterCount = useMemo(() => {
		const refinementCount = currentRefinements.reduce((total, item) => {
			const refs = item.refinements.filter(
				(r) => !(item.attribute === 'collection' && r.label === DEFAULT_COLLECTION)
			);
			return total + refs.length;
		}, 0);
		return refinementCount + (dateFilterActive ? 1 : 0);
	}, [currentRefinements, dateFilterActive]);

	// Stable date field list
	const dateFields = useMemo(
		() => ['startDate1', 'endDate1', 'startDate2', 'endDate2'],
		[]
	);

	const openFilterMenu = () => setIsFilterOpen(true);
	const closeFilterMenu = () => setIsFilterOpen(false);

	// GTM event on open
	useEffect(() => {
		if (isFilterOpen) {
			(window as any)?.dataLayer?.push({ event: 'filters_panel_opened', source: 'mobile' });
		}
	}, [isFilterOpen]);

	const dialogTitleId = 'mobile-filter-title';

	return (
		<>
			{/* Toggle Button */}
			<button
				onClick={openFilterMenu}
				type="button"
				aria-haspopup="dialog"
				aria-expanded={isFilterOpen}
				aria-label={
					activeFilterCount > 0
						? `Open filters, ${activeFilterCount} active`
						: 'Open filters'
				}
				className="md:hidden relative flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-indigo-400"
			>
				<AdjustmentsHorizontalIcon className="h-5 w-5" aria-hidden="true" />
				<span>Filters</span>
				{activeFilterCount > 0 && (
					<span
						className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-indigo-600 px-1.5 text-xs font-semibold text-white"
						aria-hidden="true"
					>
						{activeFilterCount}
					</span>
				)}
			</button>

			{/* Drawer */}
			<Dialog
				open={isFilterOpen}
				onClose={closeFilterMenu}
				className="relative z-50 lg:hidden"
				aria-labelledby={dialogTitleId}
			>
				{/* Overlay */}
				<DialogBackdrop
					transition
					className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ease-out data-[closed]:opacity-0"
				/>

				{/* Panel container */}
				<div className="fixed inset-0 overflow-hidden">
					<DialogPanel
						transition
						className="fixed inset-y-0 right-0 flex w-screen max-w-sm flex-col bg-white shadow-xl transition-transform duration-300 ease-out data-[closed]:translate-x-full dark:bg-gray-900"
					>
						{/* Header */}
						<div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
							<DialogTitle
								id={dialogTitleId}
								className="text-lg font-semibold text-gray-900 dark:text-white"
							>
								Filters
							</DialogTitle>
							<button
								type="button"
								onClick={closeFilterMenu}
								aria-label="Close filters"
								className="-mr-2 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
							>
								<span className="sr-only">Close filters</span>
								<XMarkIcon className="h-6 w-6" aria-hidden="true" />
							</button>
						</div>

						{/* Filters (scrollable) */}
						<div className="flex-1 space-y-6 overflow-y-auto overscroll-contain px-2 pt-4 pb-6">
							<CustomHierarchicalMenu
								showMore={true}
								title="Categories"
								attributes={[
									'hierarchicalCategories.lvl0',
									'hierarchicalCategories.lvl1',
									'hierarchicalCategories.lvl2',
								]}
							/>

							<CustomRefinementList label="Topic" attribute="topic" showMore />

							<DateRangeSlider
								key={resetKey}
								title="Date"
								dateFields={dateFields}
								minTimestamp={-15135361438}
								maxTimestamp={-631151999}
								value={dateRange}
								onChange={(newValue) => {
									setDateRange(newValue);
									setDateFilterActive(true);
								}}
							/>

							<CustomRefinementList label="Name" attribute="name" showSearch showMore />
							<CustomRefinementList label="Geography" attribute="geography.name" showSearch showMore />
							<CustomRefinementList label="Collection" attribute="collection" />
							<CustomRefinementList label="Language" attribute="language" showMore />
							<CustomRefinementList label="Archival Collection" attribute="subcollection" />
						</div>

						{/* Sticky footer actions */}
						<div className="sticky bottom-0 flex items-center gap-3 border-t border-gray-200 bg-white px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] dark:border-gray-700 dark:bg-gray-900">
							<CustomClearRefinements
								onResetDateSlider={onResetDateSlider}
								setDateRange={setDateRange}
								defaultDateRange={{ min: -15135361438, max: -631151999 }}
								className="shrink-0"
							/>
							<button
								type="button"
								onClick={closeFilterMenu}
								className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
							>
								See {formatNumber(nbHits)} {nbHits === 1 ? 'result' : 'results'}
							</button>
						</div>
					</DialogPanel>
				</div>
			</Dialog>
		</>
	);
}

export default MobileFilters;
