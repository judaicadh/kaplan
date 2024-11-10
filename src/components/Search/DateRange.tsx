import React, { useState, useCallback, useEffect } from 'react';
import { useRange, type UseRangeProps } from 'react-instantsearch';
import Slider from '@mui/material/Slider';
import { debounce } from 'lodash';


/*const dateToTimestamp = (dateString: string): number => {
	const timestamp = new Date(dateString).getTime();
	return timestamp;
};

const timestampToDate = (timestamp: number): string => {
	const date = new Date(timestamp);
	return date.toISOString().split('T')[0];
};
interface RangeSliderProps {
	attribute: string;
	handleRefinement: (range: { startDate: number; endDate: number }) => void;
}*/
function CustomRangeInput(props: UseRangeProps) {
	const { start, range, canRefine, refine,  } = useRange(props);

	// Helper Functions


	// Set minimum date to "1400-01-01"
	const MIN_DATE_STRING = '1400-01-01';
	const MIN_TIMESTAMP = new Date(MIN_DATE_STRING).getTime();

	// Provide default values for range.min and range.max
	const safeMin = Math.max(range.min ?? MIN_TIMESTAMP, MIN_TIMESTAMP);
	const safeMax = range.max ?? Date.now(); // Use current timestamp if range.max is undefined

	// Scaling factor to reduce the magnitude of timestamps
	const SCALE_FACTOR = 1000000;

	// Initialize rangeState with valid default values
	const [rangeState, setRangeState] = useState<RangeState>(() => {
		const initialFrom =
			start[0] != null && !isNaN(start[0]) && start[0] !== -Infinity
				? start[0]
				: safeMin;
		const initialTo =
			start[1] != null && !isNaN(start[1]) && start[1] !== Infinity
				? start[1]
				: safeMax;
		return {
			from: initialFrom,
			to: initialTo,
		};
	});

	useEffect(() => {
		// Update rangeState when start changes
		const newFrom =
			start[0] != null && !isNaN(start[0]) && start[0] !== -Infinity
				? start[0]
				: safeMin;
		const newTo =
			start[1] != null && !isNaN(start[1]) && start[1] !== Infinity
				? start[1]
				: safeMax;
		setRangeState({
			from: newFrom,
			to: newTo,
		});
	}, [start, safeMin, safeMax]);

	// Debounced refine function
	const debouncedRefine = useCallback(
		debounce((newRange: RangeState) => {
			refine([newRange.from, newRange.to]);
		}, 300),
		[refine]
	);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>, type: 'from' | 'to') => {
			const dateValue = e.target.value;
			const timestamp = dateToTimestamp(dateValue);

			if (!isNaN(timestamp)) {
				const clampedValue = Math.max(safeMin, Math.min(safeMax, timestamp));
				setRangeState((prevRange) => {
					const newRange = { ...prevRange, [type]: clampedValue };
					debouncedRefine(newRange);
					return newRange;
				});
			} else {
				setRangeState((prevRange) => {
					const newRange = { ...prevRange, [type]: safeMin };
					debouncedRefine(newRange);
					return newRange;
				});
			}
		},
		[safeMin, safeMax, debouncedRefine]
	);

	const handleSliderChange = useCallback(
		(event: Event, newValue: number | number[]) => {
			if (Array.isArray(newValue)) {
				const scaledFrom = newValue[0] * SCALE_FACTOR;
				const scaledTo = newValue[1] * SCALE_FACTOR;
				const newRange = { from: scaledFrom, to: scaledTo };
				setRangeState(newRange);
				debouncedRefine(newRange);
			}
		},
		[debouncedRefine]
	);

	const { from, to } = rangeState;

	return (
		<div>
			<div className="flex items-center">
				<label>
					From:
					<input
						type="date"
						min={timestampToDate(safeMin)}
						max={timestampToDate(safeMax)}
						value={from != null ? timestampToDate(from) : ''}
						onChange={(e) => handleInputChange(e, 'from')}
						disabled={!canRefine}
						className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
					/>
				</label>
			</div>
			<Slider
				min={safeMin / SCALE_FACTOR}
				max={safeMax / SCALE_FACTOR}
				value={[from / SCALE_FACTOR, to / SCALE_FACTOR]}
				onChange={handleSliderChange}
				valueLabelDisplay="on"
				valueLabelFormat={(value) => timestampToDate(value * SCALE_FACTOR)}
				disabled={!canRefine}
				step={86400000 / SCALE_FACTOR} // One day in milliseconds divided by scale factor
			/>
			<div className="flex items-center">
				<label>
					To:
					<input
						type="date"
						min={timestampToDate(safeMin)}
						max={timestampToDate(safeMax)}
						value={to != null ? timestampToDate(to) : ''}
						onChange={(e) => handleInputChange(e, 'to')}
						disabled={!canRefine}
						className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
					/>
				</label>
			</div>
		</div>
	);
}

export default CustomRangeInput;