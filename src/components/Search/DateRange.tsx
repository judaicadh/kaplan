import React, { useState, useEffect } from 'react';
import { Configure } from 'react-instantsearch';
import Slider from '@mui/material/Slider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

type CombinedDateRangeSliderProps = {
	minTimestamp: number;
	maxTimestamp: number;
	dateFields: string[];
};

const DateRangeSlider: React.FC<CombinedDateRangeSliderProps> = ({
																																	 minTimestamp,
																																	 maxTimestamp,
																																	 dateFields,
																																 }) => {
	const [range, setRange] = useState<[number, number]>([minTimestamp, maxTimestamp]);
	const [filterString, setFilterString] = useState<string>('');

	useEffect(() => {
		const singleCondition = `(${dateFields[0]} <= ${range[1]} AND ${dateFields[1]} >= ${range[0]})`;
		setFilterString(singleCondition);

		// Set initial values for date inputs based on the range
		const startDateInput = document.getElementById('datepicker-range-start') as HTMLInputElement;
		const endDateInput = document.getElementById('datepicker-range-end') as HTMLInputElement;
		if (startDateInput && endDateInput) {
			startDateInput.value = new Date(range[0] * 1000).toISOString().split('T')[0];
			endDateInput.value = new Date(range[1] * 1000).toISOString().split('T')[0];
		}
	}, [range, dateFields]);

	const handleSliderChange = (event: Event, newValue: number | number[]) => {
		if (Array.isArray(newValue)) {
			setRange([newValue[0], newValue[1]]);
			(document.getElementById('datepicker-range-start') as HTMLInputElement).value = new Date(newValue[0] * 1000).toISOString().split('T')[0];
			(document.getElementById('datepicker-range-end') as HTMLInputElement).value = new Date(newValue[1] * 1000).toISOString().split('T')[0];
		}
	};

	const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		const startDateInput = document.getElementById('datepicker-range-start') as HTMLInputElement;
		const endDateInput = document.getElementById('datepicker-range-end') as HTMLInputElement;
		const startDate = new Date(startDateInput.value).getTime() / 1000;
		const endDate = new Date(endDateInput.value).getTime() / 1000;

		if (!isNaN(startDate) && !isNaN(endDate) && startDate <= endDate) {
			setRange([startDate, endDate]);
		} else {
			// If input is invalid or out of range, reset to current range values
			startDateInput.value = new Date(range[0] * 1000).toISOString().split('T')[0];
			endDateInput.value = new Date(range[1] * 1000).toISOString().split('T')[0];
			alert('Please enter valid dates in the correct range.');
		}
	};

	return (
		<Grid container spacing={2} direction="column" alignItems="center">
			<Typography gutterBottom>Date Range</Typography>

			<Slider
				value={range}
				onChange={handleSliderChange}
				min={minTimestamp}
				max={maxTimestamp}
				valueLabelDisplay="on"
				valueLabelFormat={(value) => new Date(value * 1000).toISOString().split('T')[0]}
			/>

			<div id="date-range-picker" date-rangepicker="true" className="flex items-center mt-4">
				<div className="relative">
					<div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">

						<svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
								 xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
							<path
								d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
						</svg>
					</div>
					<input
						id="datepicker-range-start"
						name="start"
						type="text"
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
						placeholder="Select date start"
					/>
				</div>
				<span className="mx-4 text-gray-500">to</span>
				<div className="relative">
					<div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">

						<svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
								 xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
							<path
								d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
						</svg>
					</div>
					<input
						id="datepicker-range-end"
						name="end"
						type="text"
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
						placeholder="Select date end"
						onBlur={handleBlur}
					/>
				</div>
			</div>

			<Configure filters={filterString} />
		</Grid>
	);
};

export default DateRangeSlider;