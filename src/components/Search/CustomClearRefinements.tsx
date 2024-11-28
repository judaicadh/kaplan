import { useClearRefinements } from 'react-instantsearch'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons'

function CustomClearRefinements(props) {
	const { refine, canRefine } = useClearRefinements(props)

	// Only render the button if there are refinements to clear
	if (!canRefine) {
		return null
	}

	return (

		<button type="button"
						onClick={() => refine()}
						className=" float-right text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-2 focus:outline-none focus:ring-gray-300 rounded-lg text-xs px-2 py-2.5 text-center me-0  dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800">
			<FontAwesomeIcon icon={faFilterCircleXmark} className="pr-2" />
			Clear Filters
		</button>

	)
}

export default CustomClearRefinements