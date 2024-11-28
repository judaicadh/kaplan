import React from 'react'
import {
	useHierarchicalMenu,
	type UseHierarchicalMenuProps
} from 'react-instantsearch'

function CustomHierarchicalMenu(props: UseHierarchicalMenuProps) {
	const {
		items,
		refine,
		canToggleShowMore,
		toggleShowMore,
		isShowingMore,
		createURL
	} = useHierarchicalMenu(props)
	const typeDescriptions = {
		letters: 'Correspondence including personal and business communications.',
		photographs: 'Visual materials capturing moments in history.',
		manuscripts: 'Handwritten or typed documents of significant value.',
		trade_cards: 'Promotional items used in trade during the 19th century.'
		// Add more types as needed
	}

	return (
		<div className="space-y-4">
			{/* Render the hierarchical menu */}
			<HierarchicalList items={items} onNavigate={refine} createURL={createURL} />

			{/* Show More/Less button */}
			{props.showMore && (
				<button
					disabled={!canToggleShowMore}
					onClick={toggleShowMore}
					className="text-sm font-medium text-sky-600 hover:text-sky-700 transition"
				>
					{isShowingMore ? 'Show less' : 'Show more'}
				</button>
			)}
		</div>
	)
}

type HierarchicalListProps = Pick<
	ReturnType<typeof useHierarchicalMenu>,
	'items' | 'createURL'
> & {
	onNavigate(value: string): void;
};

const HierarchicalList = React.memo(function HierarchicalList({
																																items,
																																createURL,
																																onNavigate
																															}: HierarchicalListProps) {
	if (!items || items.length === 0) {
		return null // No categories to display
	}

	return (
		<ul className="space-y-2">
			{items.map((item) => (
				<li key={item.value} className="relative">
					{/* Render the parent category */}
					<a
						href={createURL(item.value)}
						aria-current={item.isRefined ? 'page' : undefined}
						aria-expanded={!!item.data}
						className={`block py-2 px-3 text-sm rounded-lg font-medium transition-all ${
							item.isRefined
								? 'bg-sky-100 text-sky-700 underline font-semibold'
								: 'text-gray-700 text-sm hover:bg-gray-100'
						}`}
						onClick={(event) => {
							if (isModifierClick(event)) {
								return
							}
							event.preventDefault()

							onNavigate(item.value)
						}}
					>
						<div className="flex items-center justify-between">
							<span>{item.label}</span>
							<span
								className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
							>
                {item.count}
              </span>
							{item.data && item.data.length > 0 && (
								<svg
									className={`w-4 h-4 ml-2 ${
										item.isRefined ? 'rotate-90' : ''
									} transition-transform`}
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							)}
						</div>
					</a>

					{/* Add the description */}
					{item.description && (
						<p className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
							{item.description}{' '}
							<button
								data-popover-target={`popover-description-${item.value}`}
								data-popover-placement="bottom-end"
								type="button"
							>
								<svg
									className="w-4 h-4 ml-2 text-gray-400 hover:text-gray-500"
									aria-hidden="true"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fillRule="evenodd"
										d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
										clipRule="evenodd"
									/>
								</svg>
								<span className="sr-only">Show information</span>
							</button>
						</p>
					)}

					{/* Render subcategories */}
					{item.data && (
						<div className="ml-4 border-l border-gray-300 pl-4">
							<HierarchicalList
								items={item.data}
								onNavigate={onNavigate}
								createURL={createURL}
							/>
						</div>
					)}
				</li>
			))}
		</ul>
	);
})

function isModifierClick(event: React.MouseEvent) {
	const isMiddleClick = event.button === 1
	return Boolean(
		isMiddleClick ||
		event.altKey ||
		event.ctrlKey ||
		event.metaKey ||
		event.shiftKey
	)
}

export default CustomHierarchicalMenu