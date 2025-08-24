import React, { useEffect, useRef, useState } from 'react';
import { useHitsPerPage, type UseHitsPerPageProps } from 'react-instantsearch';

type CustomHitsPerPageProps = UseHitsPerPageProps & {
	/** Optional: push a GTM event when user changes hitsPerPage */
	gtmEventName?: string; // e.g., "algolia_hits_per_page_changed"
};

declare global {
	interface Window { dataLayer?: any[] }
}

function CustomHitsPerPage(props: CustomHitsPerPageProps) {
	const { items, refine, canRefine } = useHitsPerPage(props);
	const [isOpen, setIsOpen] = useState(false);

	const btnRef = useRef<HTMLButtonElement | null>(null);
	const listRef = useRef<HTMLUListElement | null>(null);

	const toggle = () => setIsOpen((p) => !p);
	const close = () => setIsOpen(false);

	// Close on click outside / ESC
	useEffect(() => {
		if (!isOpen) return;
		const onDocClick = (e: MouseEvent) => {
			const t = e.target as Node;
			if (listRef.current?.contains(t) || btnRef.current?.contains(t)) return;
			close();
		};
		const onEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape') close();
		};
		document.addEventListener('mousedown', onDocClick);
		document.addEventListener('keydown', onEsc);
		return () => {
			document.removeEventListener('mousedown', onDocClick);
			document.removeEventListener('keydown', onEsc);
		};
	}, [isOpen]);

	const onChoose = (value: number | string, label: string) => {
		const numeric = typeof value === 'string' ? Number(value) : value;
		if (!Number.isFinite(numeric)) return; // guard against bad values
		refine(numeric);
		setIsOpen(false);

		if (props.gtmEventName) {
			window.dataLayer?.push({
				event: props.gtmEventName,
				algolia: { hitsPerPage: numeric, label },
			});
		}
	};

	const current = items.find(i => i.isRefined)?.label ?? 'Hits per page';

	return (
		<div className="relative hits-per-page-container">
			<button
				ref={btnRef}
				id="hitsPerPageButton"
				type="button"
				onClick={toggle}
				disabled={!canRefine}
				aria-haspopup="listbox"
				aria-expanded={isOpen}
				className="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto"
			>
				{current}
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

			{isOpen && (
				<ul
					ref={listRef}
					role="listbox"
					aria-labelledby="hitsPerPageButton"
					className="absolute z-10 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800"
				>
					{items.map((item) => (
						<li
							key={String(item.value)}
							role="option"
							aria-selected={item.isRefined}
							tabIndex={0}
							className={`px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 hover:text-primary-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer ${item.isRefined ? 'font-bold' : ''}`}
							onClick={() => onChoose(item.value as number | string, item.label)}
							onKeyDown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									onChoose(item.value as number | string, item.label);
								}
							}}
						>
							{item.label}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export default CustomHitsPerPage;