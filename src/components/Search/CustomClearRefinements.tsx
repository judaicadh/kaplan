// components/Search/CustomClearRefinements.tsx
import React from 'react';
import {
	useClearRefinements,
	type UseClearRefinementsProps,
} from 'react-instantsearch';

declare global {
	interface Window { dataLayer?: any[] }
}

type DateRange = { min: number; max: number };

type CustomClearRefinementsProps = UseClearRefinementsProps & {
	/** Optional: also reset your external date slider */
	onResetDateSlider?: () => void;
	/** If you manage date slider state here, pass setter + default */
	setDateRange?: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
	defaultDateRange?: DateRange;
	/** Optional: push a GTM event name (e.g., "algolia_clear_all") */
	gtmEventName?: string;
	/** If you persist the date in localStorage, pass the key to clear it */
	dateStorageKey?: string; // e.g. "algolia_date_range"
	className?: string;
};

const CustomClearRefinements: React.FC<CustomClearRefinementsProps> = ({
																																				 onResetDateSlider,
																																				 setDateRange,
																																				 defaultDateRange,
																																				 gtmEventName,
																																				 dateStorageKey,
																																				 className,
																																				 ...aisProps
																																			 }) => {
	const { refine, canRefine } = useClearRefinements(aisProps);

	const handleClick = () => {
		// 1) Clear Algolia refinements
		refine();

		// 2) Reset your date slider UI
		onResetDateSlider?.();
		if (setDateRange && defaultDateRange) setDateRange({ ...defaultDateRange });

		// 3) Remove date params from URL (?start=&end=)
		try {
			const url = new URL(window.location.href);
			url.searchParams.delete('start');
			url.searchParams.delete('end');
			window.history.replaceState(null, '', url.toString());
		} catch { /* noop */ }

		// 4) Clear persisted date range (if used)
		if (dateStorageKey) {
			try { localStorage.removeItem(dateStorageKey); } catch { /* noop */ }
		}

		// 5) Optional GTM signal
		if (gtmEventName) {
			window.dataLayer?.push({
				event: gtmEventName,
				algolia: { cleared: ['refinements', 'dateRange'] },
			});
		}
	};

	return (
		<div className={`ais-ClearRefinements ${className ?? ''}`}>
			<button
				type="button"
				onClick={handleClick}
				disabled={!canRefine}
				className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm
          ${canRefine
					? 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-700'
					: 'opacity-50 cursor-not-allowed bg-white text-gray-400 border-gray-200 dark:bg-gray-8 00 dark:text-gray-500 dark:border-gray-700'
				}`}
				aria-disabled={!canRefine}
				aria-label="Clear all filters"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" aria-hidden="true">
					<g fill="none" fillRule="evenodd">
						<path d="M0 0h11v11H0z" />
						<path
							fill="currentColor"
							fillRule="nonzero"
							d="M8.26 2.75a3.896 3.896 0 1 0 1.102 3.262l.007-.056a.49.49 0 0 1 .485-.456c.253 0 .451.206.437.457 0 0 .012-.109-.006.061a4.813 4.813 0 1 1-1.348-3.887v-.987a.458.458 0 1 1 .917.002v2.062a.459.459 0 0 1-.459.459H7.334a.458.458 0 1 1-.002-.917h.928z"
						/>
					</g>
				</svg>
				Clear filters
			</button>
		</div>
	);
};

export default CustomClearRefinements;