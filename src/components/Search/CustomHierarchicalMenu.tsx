import React, { useEffect, useMemo, useRef } from "react";
import {
	useHierarchicalMenu,
	type UseHierarchicalMenuProps,
} from "react-instantsearch";

type CustomHierarchicalMenuProps = UseHierarchicalMenuProps & {
	title: string;
};

function makeFilterAttr(topLevelAttr: string | undefined, itemValue: string) {
	return `${topLevelAttr ?? "category"}:${itemValue}`;
}

type HMItem = ReturnType<typeof useHierarchicalMenu>["items"][number];

function cloneWithZeroCounts(items: HMItem[] | undefined): HMItem[] {
	if (!items || !items.length) return [];
	return items.map((it) => ({
		...it,
		count: 0,
		isRefined: false,
		data: cloneWithZeroCounts(it.data),
	}));
}

function CustomHierarchicalMenu(props: CustomHierarchicalMenuProps) {
	const {
		items,
		refine,
		canToggleShowMore,
		toggleShowMore,
		isShowingMore,
		createURL,
	} = useHierarchicalMenu(props);

	// Use the first attribute as a readable prefix for GTM filter labels
	const topLevelAttr = Array.isArray(props.attributes)
		? props.attributes[0]
		: undefined;

	const typeDescriptions: Record<string, string> = {};

	// Keep a snapshot of the last non-empty items
	const lastNonEmptyRef = useRef<HMItem[] | null>(null);
	useEffect(() => {
		if (items && items.length) {
			lastNonEmptyRef.current = items;
		}
	}, [items]);

	// Decide what to render:
	// - if we have items, render them (interactive)
	// - else, render the last known structure with counts 0 (non-interactive)
	const { renderItems, interactive } = useMemo(() => {
		if (items && items.length) {
			return { renderItems: items, interactive: true as const };
		}
		const fallback = cloneWithZeroCounts(lastNonEmptyRef.current ?? []);
		return { renderItems: fallback, interactive: false as const };
	}, [items]);

	return (
		<div className="w-full px-4 pb-6">
			<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
				{props.title}
			</h3>

			<HierarchicalList
				items={renderItems}
				onNavigate={refine}
				createURL={createURL}
				typeDescriptions={typeDescriptions}
				topLevelAttr={topLevelAttr}
				interactive={interactive}
			/>

			{canToggleShowMore && (
				<button
					type="button"
					onClick={toggleShowMore}
					className="mt-4 w-full p-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md dark:bg-gray-700 dark:text-blue-400 dark:hover:bg-gray-600"
					aria-expanded={isShowingMore}
					disabled={!interactive}
				>
					{isShowingMore ? "Show Less" : "Show More"}
				</button>
			)}
		</div>
	);
}

type HierarchicalListProps = Pick<
	ReturnType<typeof useHierarchicalMenu>,
	"items" | "createURL"
> & {
	onNavigate(value: string): void;
	typeDescriptions: Record<string, string>;
	topLevelAttr?: string;
	/** when false, render but disable interactions (counts are zeroed) */
	interactive: boolean;
};

const HierarchicalList = React.memo(function HierarchicalList({
																																items,
																																createURL,
																																onNavigate,
																																typeDescriptions,
																																topLevelAttr,
																																interactive,
																															}: HierarchicalListProps) {
	// Always render the list (even if empty) so the block doesn't collapse visually.
	if (!items || items.length === 0) {
		return (
			<ul className="space-y-1">
				<li className="text-sm text-gray-400 dark:text-gray-500 px-3 py-2">
					No categories
				</li>
			</ul>
		);
	}

	return (
		<ul className="space-y-1">
			{items.map((item) => {
				const descriptionKey = item.label.trim();

				return (
					<li key={item.value} className="relative">
						<div className="flex items-center justify-between w-full">
							<div className="flex items-center gap-2 w-full">
								<a
									href={createURL(item.value)}
									onClick={(e) => {
										e.preventDefault();
										if (interactive && item.count > 0) {
											onNavigate(item.value);
										}
									}}
									aria-current={interactive && item.isRefined ? "page" : undefined}
									data-insights-filter={
										interactive ? makeFilterAttr(topLevelAttr, item.value) : undefined
									}
									className={`flex-grow text-left py-2 px-3 text-sm rounded-lg font-medium transition ${
										interactive && item.isRefined
											? "bg-sky-100 text-sky-700 underline font-semibold"
											: interactive && item.count > 0
												? "text-gray-700 hover:bg-gray-100 dark:text-gray-300"
												: "text-gray-400 dark:text-gray-500 cursor-not-allowed"
									}`}
									aria-disabled={!interactive || item.count === 0}
								>
									{item.label}
								</a>

								{/* Optional info tooltip */}
								{typeDescriptions[descriptionKey] && (
									<div className="relative group shrink-0">
										<button
											type="button"
											className="text-gray-400 hover:text-gray-500 focus:outline-none"
											aria-label={`More info about ${item.label}`}
											disabled={!interactive}
										>
											<svg
												className="w-4 h-4"
												aria-hidden="true"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fillRule="evenodd"
													d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
													clipRule="evenodd"
												></path>
											</svg>
											<span className="sr-only">Show information</span>
										</button>
										<div
											className="absolute hidden group-hover:block z-10 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm w-72 p-3 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400"
											style={{ top: "100%", left: "0" }}
										>
											<h3 className="font-semibold text-gray-900 dark:text-white">
												{item.label}
											</h3>
											<p>{typeDescriptions[descriptionKey]}</p>
										</div>
									</div>
								)}
							</div>

							{/* Count (show 0s when interactive=false) */}
							<span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                {interactive ? item.count : 0}
              </span>
						</div>

						{/* Children */}
						{item.data && item.data.length > 0 && (
							<div className="ml-4 mt-2 border-l border-gray-200 pl-4 dark:border-gray-700">
								<HierarchicalList
									items={item.data}
									onNavigate={onNavigate}
									createURL={createURL}
									typeDescriptions={typeDescriptions}
									topLevelAttr={topLevelAttr}
									interactive={interactive}
								/>
							</div>
						)}
					</li>
				);
			})}
		</ul>
	);
});

export default CustomHierarchicalMenu;