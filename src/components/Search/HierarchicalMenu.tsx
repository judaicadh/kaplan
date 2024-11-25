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
						className={`block py-2  px-3 text-sm  rounded-lg font-medium transition-all ${
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
								className="ml-2  bg-gray-100 text-gray-800 text-xs font-medium   px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">{item.count}</span>
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
	)
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