import { useCurrentRefinements } from 'react-instantsearch'

function CustomCurrentRefinements(props) {
	const { items, canRefine, refine } = useCurrentRefinements(props)

	if (!canRefine) {
		return null // Hide if no refinements are applied
	}

	return (
		<div className="sm:hidden md:flex">

			<ul className="space-y-1">
				{items.map((item) => (
					<li key={item.label} className="flex items-center space-x-2">  {item.refinements.map((refinement) => (
						<button
							key={refinement.label}
							onClick={() => refine(refinement)}
							className="px-2 py-1 text-xs font-medium text-white bg-sky-600 rounded hover:bg-sky-500"
						>
							{refinement.label} ✕
						</button>
					))}
					</li>
				))}
			</ul>
		</div>
	)
}

export default CustomCurrentRefinements