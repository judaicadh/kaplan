import React from 'react';
import {
	useCurrentRefinements,
	type UseCurrentRefinementsProps,
} from 'react-instantsearch';

declare global {
	interface Window { dataLayer?: any[] }
}

type CustomCurrentRefinementsProps = UseCurrentRefinementsProps & {
	/** Optional: push a GTM event when a refinement is removed */
	gtmRemoveEventName?: string; // e.g. "algolia_refinement_removed"
};

function stringifyRefValue(value: unknown): string {
	if (value == null) return '';
	if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
		return String(value);
	}
	// ranges or objects:
	try {
		return JSON.stringify(value);
	} catch {
		return String(value);
	}
}

const CustomCurrentRefinements: React.FC<CustomCurrentRefinementsProps> = (props) => {
	const { items, canRefine, refine } = useCurrentRefinements(props);

	if (!canRefine) return null;

	return (
		<div className="sm:hidden md:flex">
			<ul className="flex flex-wrap gap-2">
				{items.map((item) =>
					item.refinements.map((ref) => {
						const valueStr = stringifyRefValue(ref.value);
						const key = `${item.indexName ?? 'idx'}:${ref.attribute}:${valueStr}`;

						return (
							<li key={key}>
								<button
									type="button"
									onClick={() => {
										refine(ref);

										// Optional GTM push
										if (props.gtmRemoveEventName) {
											window.dataLayer?.push({
												event: props.gtmRemoveEventName,
												algolia: {
													attribute: ref.attribute,
													label: ref.label,
													value: valueStr,
												},
											});
										}
									}}
									// Let GTM pick up which filter was clicked
									data-insights-filter={`${ref.attribute}:${valueStr}`}
									className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-sky-600 rounded hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-500"
									aria-label={`Remove filter ${ref.label}`}
								>
									{ref.label} <span aria-hidden>✕</span>
								</button>
							</li>
						);
					})
				)}
			</ul>
		</div>
	);
};

export default CustomCurrentRefinements;