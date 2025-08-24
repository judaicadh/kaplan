import { useEffect, useRef, useState } from 'react';
import { useSortBy } from 'react-instantsearch';

declare global {
	interface Window { dataLayer?: any[] }
}

type CustomSortByProps = {
	/** Optional: event name to push to GTM when user changes sort */
	gtmEventName?: string; // default: "algolia_sort_changed"
};

function CustomSortBy({ gtmEventName = 'algolia_sort_changed' }: CustomSortByProps) {
	const { currentRefinement, options, refine } = useSortBy({
		items: [
			{ value: 'Dev_Kaplan', label: 'Relevance' },
			{ value: 'title_asc', label: 'Title Ascending' },
			{ value: 'title_desc', label: 'Title Descending' },
			{ value: 'date_asc', label: 'Date Ascending' },
			{ value: 'date_desc', label: 'Date Descending' },
			{ value: 'id_asc', label: 'ID Ascending' },
			{ value: 'id_desc', label: 'ID Descending' },
		],
	});

	const [isOpen, setIsOpen] = useState(false);
	const btnRef = useRef<HTMLButtonElement | null>(null);
	const listRef = useRef<HTMLUListElement | null>(null);

	const currentLabel = options.find(o => o.value === currentRefinement)?.label ?? 'Sort';

	const choose = (value: string) => {
		if (value === currentRefinement) {
			setIsOpen(false);
			return;
		}

		const prev = currentRefinement;
		refine(value);
		setIsOpen(false);

		// Push to GTM
		const selected = options.find(o => o.value === value);
		const previous = options.find(o => o.value === prev);

		window.dataLayer?.push({
			event: gtmEventName,
			algolia: {
				previousSort: previous ? { value: previous.value, label: previous.label } : null,
				selectedSort: selected ? { value: selected.value, label: selected.label } : { value },
			},
		});
	};

	// Close on outside click / Esc
	useEffect(() => {
		if (!isOpen) return;

		const onDocClick = (e: MouseEvent) => {
			const t = e.target as Node;
			if (listRef.current?.contains(t) || btnRef.current?.contains(t)) return;
			setIsOpen(false);
		};
		const onEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setIsOpen(false);
		};

		document.addEventListener('mousedown', onDocClick);
		document.addEventListener('keydown', onEsc);
		return () => {
			document.removeEventListener('mousedown', onDocClick);
			document.removeEventListener('keydown', onEsc);
		};
	}, [isOpen]);

	return (
		<div className="relative sort-by-container">
			<button
				ref={btnRef}
				id="sortDropdownButton1"
				onClick={() => setIsOpen(o => !o)}
				type="button"
				aria-haspopup="listbox"
				aria-expanded={isOpen}
				aria-controls="sortDropdownList1"
				className="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto"
			>
				<svg
					className="-ms-0.5 me-2 h-4 w-4"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					width="24" height="24" fill="none" viewBox="0 0 24 24"
				>
					<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
								d="M7 4v16M7 4l3 3M7 4 4 7m9-3h6l-6 6h6m-6.5 10 3.5-7 3.5 7M14 18h4"/>
				</svg>
				{currentLabel}
				<svg
					className="-me-0.5 ms-2 h-4 w-4"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					width="24" height="24" fill="none" viewBox="0 0 24 24"
				>
					<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
								d="m19 9-7 7-7-7"/>
				</svg>
			</button>

			{isOpen && (
				<ul
					ref={listRef}
					id="sortDropdownList1"
					role="listbox"
					aria-labelledby="sortDropdownButton1"
					className="absolute z-10 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800"
					onClick={() => setIsOpen(false)}
				>
					{options.map((option) => (
						<li
							key={option.value}
							role="option"
							aria-selected={currentRefinement === option.value}
							tabIndex={0}
							className={`px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 hover:text-primary-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer ${
								currentRefinement === option.value ? 'font-bold' : ''
							}`}
							onClick={() => choose(option.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									choose(option.value);
								}
							}}
							// Optional: expose value/label for GTM via data attributes
							data-sort-value={option.value}
							data-sort-label={option.label}
						>
							{option.label}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export default CustomSortBy;