// @components/Search/MobileFilters.tsx
import { useState, useEffect, useRef, useMemo } from 'react';
import DateRangeSlider from '@components/Search/DateRangeSlider.tsx';
import CustomRefinementList from '@components/Search/CustomRefinementList.tsx';
import CustomHierarchicalMenu from '@components/Search/CustomHierarchicalMenu.tsx';
import CustomClearRefinements from '@components/Search/CustomClearRefinements.tsx';

type MobileFiltersProps = {
	resetKey: number;
	onResetDateSlider: () => void;
	dateFilterActive: boolean;
	setDateFilterActive: React.Dispatch<React.SetStateAction<boolean>>;
	dateRange: { min: number; max: number } | undefined;
	setDateRange: React.Dispatch<React.SetStateAction<{ min: number; max: number } | undefined>>;
};

function MobileFilters({
												 resetKey,
												 dateFilterActive,
												 onResetDateSlider,
												 setDateFilterActive,
												 dateRange,
												 setDateRange,
											 }: MobileFiltersProps) {
	const [isFilterOpen, setIsFilterOpen] = useState(false);

	// Refs
	const filterPanelRef = useRef<HTMLDivElement | null>(null);
	const toggleButtonRef = useRef<HTMLButtonElement | null>(null);

	// Stable date field list
	const dateFields = useMemo(
		() => ['startDate1', 'endDate1', 'startDate2', 'endDate2'],
		[]
	);

	const toggleFilterMenu = () => setIsFilterOpen((prev) => !prev);

	// Close on Escape + outside click
	useEffect(() => {
		const handleEsc = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setIsFilterOpen(false);
		};

		const handleOutsideClick = (event: MouseEvent) => {
			const target = event.target as Node | null;
			if (
				filterPanelRef.current &&
				!filterPanelRef.current.contains(target) &&
				toggleButtonRef.current &&
				!toggleButtonRef.current.contains(target)
			) {
				setIsFilterOpen(false);
			}
		};

		document.addEventListener('keydown', handleEsc);
		document.addEventListener('mousedown', handleOutsideClick);
		return () => {
			document.removeEventListener('keydown', handleEsc);
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, []);

	// Lock body scroll when open
	useEffect(() => {
		if (!isFilterOpen) return;
		const { body } = document;
		const prev = body.style.overflow;
		body.style.overflow = 'hidden';
		return () => {
			body.style.overflow = prev;
		};
	}, [isFilterOpen]);

	// (Optional) GTM event on open
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
				ref={toggleButtonRef}
				onClick={toggleFilterMenu}
				type="button"
				aria-expanded={isFilterOpen}
				aria-controls="mobile-filter-panel"
				aria-label="Toggle filter menu"
				className="md:hidden flex items-center justify-end gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-indigo-400"
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

			{/* Panel */}
			{isFilterOpen && (
				<div
					className="relative z-40 lg:hidden"
					role="dialog"
					aria-modal="true"
					aria-labelledby={dialogTitleId}
				>
					{/* Overlay */}
					<div className="fixed inset-0 bg-black/25 backdrop-blur-sm transition-opacity" aria-hidden="true" />

					{/* Drawer */}
					<div
						id="mobile-filter-panel"
						ref={filterPanelRef}
						className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col bg-white dark:bg-gray-800 shadow-xl overflow-y-auto"
					>
						<div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
							<h2 id={dialogTitleId} className="text-lg font-medium text-gray-900 dark:text-white">
								Filters
							</h2>
							<button
								type="button"
								onClick={toggleFilterMenu}
								aria-label="Close filter menu"
								className="rounded-md p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:hover:bg-gray-700"
							>
								<span className="sr-only">Close menu</span>
								<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						{/* Filters */}
						<form className="flex-1 border-t border-gray-200 dark:border-gray-700 space-y-6 px-2 pt-4 pb-24 overflow-y-auto">
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

							<CustomRefinementList label="Name" attribute="name" showMore />
							<CustomRefinementList label="Geography" attribute="geography.name" showMore />
							<CustomRefinementList label="Collection" attribute="collection" />
							<CustomRefinementList label="Language" attribute="language" showMore />
							<CustomRefinementList label="Archival Collection" attribute="subcollection" />
						</form>

						{/* Footer actions */}
						<div className="fixed bottom-0 w-full max-w-xs bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-4">
							<div className="w-full text-center">
								<CustomClearRefinements
									onResetDateSlider={onResetDateSlider}

								/>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default MobileFilters;