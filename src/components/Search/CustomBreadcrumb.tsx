import React, { useEffect, useRef } from 'react';
import { useBreadcrumb } from 'react-instantsearch';

declare global {
	interface Window { dataLayer?: any[] }
}

type Props = { attributes: string[] };

function CustomBreadcrumb({ attributes }: Props) {
	const { items, canRefine, refine, createURL } = useBreadcrumb({ attributes });
	const lastPayloadRef = useRef<string>("");

	// Push a GTM view event when the breadcrumb changes (rendered client-side)
	useEffect(() => {
		if (!canRefine || items.length === 0) return;

		const pathLabels = items.map(i => i.label);
		const refinedIndex = items.findIndex((i: any) => i.isRefined);
		const payload = JSON.stringify({ pathLabels, refinedIndex });

		// avoid noisy duplicates
		if (payload !== lastPayloadRef.current) {
			window.dataLayer?.push({
				event: 'algolia_breadcrumb_view',
				algolia: {
					pathLabels,           // ["Form", "Subform", ...]
					refinedIndex,         // -1 if none, else index of refined crumb
					attributePath: attributes, // levels you're using
				}
			});
			lastPayloadRef.current = payload;
		}
	}, [items, canRefine, attributes]);

	if (!canRefine || items.length === 0) return null;

	return (
		<nav
			className="flex items-center px-4 py-3 text-sm sm:text-base text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
			aria-label="Breadcrumb"
		>
			<ol className="inline-flex items-center flex-wrap gap-x-1 md:gap-x-2 rtl:space-x-reverse">
				{items.map((item, index) => {
					// Map crumb index -> matching hierarchical attribute (lvl0/lvl1/lvl2)
					const attribute = attributes[Math.min(index, attributes.length - 1)];
					// For GTM's data-insights-filter format: `${attribute}:${value}`
					// Using item.label keeps it human-readable; GTM template only needs "attr:value"
					const dataFilter = `${attribute}:${item.label}`;

					return (
						<li key={`${item.label}-${index}`} className="inline-flex items-center">
							{index > 0 && (
								<svg
									className="w-3 h-3 text-gray-400 mx-1"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 6 10"
								>
									<path
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M1 9L5 5 1 1"
									/>
								</svg>
							)}

							<a
								href={createURL(item.value)}
								data-insights-filter={dataFilter} // 👈 GTM can read this with your custom var
								className={`${
									(item as any).isRefined
										? "text-blue-600 dark:text-blue-400 font-semibold"
										: "text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
								}`}
								onClick={(event) => {
									event.preventDefault();

									// Push a GTM click event (helps tie to Algolia Insights clickedFilters)
									window.dataLayer?.push({
										event: 'algolia_breadcrumb_click',
										algolia: {
											attribute,
											label: item.label,
											value: item.value, // Algolia hierarchical path value (e.g. "A > B")
											index,             // level clicked
										}
									});

									refine(item.value);
								}}
							>
								{item.label}
							</a>
						</li>
					);
				})}
			</ol>
		</nav>
	);
}

export default CustomBreadcrumb;