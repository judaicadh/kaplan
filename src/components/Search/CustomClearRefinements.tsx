import { useClearRefinements } from "react-instantsearch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilterCircleXmark } from "@fortawesome/free-solid-svg-icons";

type Props = {
	onResetDateSlider: () => void;
	dateFilterActive?: boolean;
	dateRange?: { min: number; max: number };
	setDateRange?: React.Dispatch<React.SetStateAction<{ min: number; max: number } | undefined>>;
	defaultDateRange?: { min: number; max: number };
};

function CustomClearRefinements({ onResetDateSlider, dateFilterActive, setDateRange }: Props) {
	const { refine, canRefine } = useClearRefinements();

	const handleClear = () => {
		if (canRefine) {
			refine();
		}
		if (dateFilterActive) {
			onResetDateSlider();
			setDateRange?.(undefined);
		}
	};

	// Only show button if there are refinements or a date is active
	if (!canRefine && !dateFilterActive) return null;

	return (
		<button
			type="button"
			onClick={handleClear}
			className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
		>
			<FontAwesomeIcon icon={faFilterCircleXmark} className="text-sm" />
			Clear Filters
		</button>
	);
}

export default CustomClearRefinements;