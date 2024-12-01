import React from 'react'
import {
	useHierarchicalMenu,
	type UseHierarchicalMenuProps
} from 'react-instantsearch';

type CustomHierarchicalMenuProps = UseHierarchicalMenuProps & {
	title: string;
};

function CustomHierarchicalMenu(props: CustomHierarchicalMenuProps) {
	const {
		items,
		refine,
		canToggleShowMore,
		toggleShowMore,
		isShowingMore,
		createURL
	} = useHierarchicalMenu(props);

	const typeDescriptions = {
		letters: 'Correspondence including personal and business communications.',
		photographs: 'Visual materials capturing moments in history.',
		manuscripts: 'Handwritten or typed documents of significant value.',
		trade_cards: 'Promotional items used in trade during the 19th century.'
		// Add more types as needed
	};

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{props.title}</h3>
			{/* Render the hierarchical menu */}
			<HierarchicalList
				items={items}
				onNavigate={refine}
				createURL={createURL}
				typeDescriptions={typeDescriptions}
			/>

			{/* Show More/Less button */}
			{canToggleShowMore && (
				<button
					type="button"
					onClick={toggleShowMore}
					className="mt-3 w-full p-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md dark:bg-gray-700 dark:text-blue-400 dark:hover:bg-gray-600"
					aria-expanded={isShowingMore}
				>
					{isShowingMore ? 'Show Less' : 'Show More'}
				</button>
			)}
		</div>
	);
}

type HierarchicalListProps = Pick<
	ReturnType<typeof useHierarchicalMenu>,
	'items' | 'createURL'
> & {
	onNavigate(value: string): void;
	typeDescriptions: Record<string, string>;
};

const HierarchicalList = React.memo(function HierarchicalList({
																																items,
																																createURL,
																																onNavigate,
																																typeDescriptions
																															}: HierarchicalListProps) {
	if (!items || items.length === 0) {
		return null // No categories to display
	}

	return (

		<ul role="list" className="px-2 py-3 font-medium text-gray-900">
			{items.map((item) => (
				<li key={item.value} className="relative">
					<a
						href={createURL(item.value)}
						aria-current={item.isRefined ? 'page' : undefined}
						className={`block py-2 px-3 text-sm rounded-lg font-medium transition-all ${
							item.isRefined
								? 'bg-sky-100 text-sky-700 underline font-semibold'
								: 'text-gray-700 hover:bg-gray-100 dark:text-gray-300'
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
						</div>
					</a>

					{/* Add the description */}
					{typeDescriptions[item.label.toLowerCase()] && (
						<p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
							{typeDescriptions[item.label.toLowerCase()]}
						</p>
					)}

					{/* Render subcategories */}
					{item.data && (
						<div className="ml-4 border-l border-gray-300 pl-4">
							<HierarchicalList
								items={item.data}
								onNavigate={onNavigate}
								createURL={createURL}
								typeDescriptions={typeDescriptions}
							/>
						</div>
					)}
				</li>
			))}
		</ul>
	);
});

function isModifierClick(event: React.MouseEvent) {
	const isMiddleClick = event.button === 1
	return (
		isMiddleClick ||
		event.altKey ||
		event.ctrlKey ||
		event.metaKey ||
		event.shiftKey
	);
}

export default CustomHierarchicalMenu