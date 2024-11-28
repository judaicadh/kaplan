import { useToggleRefinement } from 'react-instantsearch'

function CustomToggleRefinement({ attribute, label }) {
	const { value, canRefine, refine } = useToggleRefinement({ attribute })
	return (
		<div className={`flex items-center space-x-3  ${!canRefine && 'opacity-50 cursor-not-allowed'}`}>
			{/* Toggle Switch */}
			<label className=" relative inline-flex items-center cursor-pointer space-x-2">
				<input
					type="checkbox"
					checked={value.isRefined}
					onChange={event => refine({ isRefined: !event.target.checked })}
					disabled={!canRefine}
					className="sr-only"
				/>

				<div
					className={`w-11 h-6 rounded-full border-sky-600 border-2 transition-colors duration-300 ${
						value.isRefined ? 'bg-sky-600' : 'bg-gray-300'
					}`}
				>
					<div
						className={`w-5 h-5 absolute top-0.5 bg-white rounded-full transition-transform duration-300 transform ${
							value.isRefined ? 'translate-x-5' : ''
						}`}
					></div>
				</div>
			</label>

			{/* Label and Counts */}
			<div className="flex flex-col text-gray-900 dark:text-gray-300">
				<span className="text-sm font-medium">{label}</span>
				<span className="text-xs text-gray-500">
          {value.isRefined ? `${value.onFacetValue.count} results` : `${value.offFacetValue.count} results`}
        </span>
			</div>
		</div>
	)
}

export default CustomToggleRefinement