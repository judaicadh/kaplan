import React, { useState, useEffect } from 'react';
import { Configure } from 'react-instantsearch';
import Slider from '@mui/material/Slider';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import dayjs, { Dayjs } from 'dayjs';

type CombinedDateRangeSliderProps = {
	minTimestamp: number;
	maxTimestamp: number;
	dateFields: string[];
	attribute?: string;
	title: string;
};

const DateRangeSlider: React.FC<CombinedDateRangeSliderProps> = ({
																																	 minTimestamp,
																																	 maxTimestamp,
																																	 dateFields,
																																	 attribute,
																																	 title,
																																 }) => {
	const [range, setRange] = useState<[number, number]>([minTimestamp, maxTimestamp]);
	const [filterString, setFilterString] = useState<string>('');
	const [startDate, setStartDate] = useState<Dayjs>(dayjs(minTimestamp * 1000));
	const [endDate, setEndDate] = useState<Dayjs>(dayjs(maxTimestamp * 1000));

	useEffect(() => {
		const singleCondition = `(${dateFields[0]} <= ${range[1]} AND ${dateFields[1]} >= ${range[0]})`;
		setFilterString(singleCondition);

		// Debounced update for URL
		const updateURL = setTimeout(() => {
			const startISO = startDate.format('YYYY-MM-DD');
			const endISO = endDate.format('YYYY-MM-DD');

			const url = new URL(window.location.href);
			url.searchParams.set("start", startISO);
			url.searchParams.set("end", endISO);
			window.history.replaceState(null, '', url.toString());
		}, 500);

		return () => clearTimeout(updateURL);
	}, [range, startDate, endDate, dateFields]);

	const handleSliderChange = (event: Event, newValue: number | number[]) => {
		if (Array.isArray(newValue)) {
			setRange([newValue[0], newValue[1]]);
			setStartDate(dayjs(newValue[0] * 1000));
			setEndDate(dayjs(newValue[1] * 1000));
		}
	};

	const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newDate = dayjs(event.target.value, 'YYYY-MM-DD');
		setStartDate(newDate);
		setRange([newDate.unix(), range[1]]);
	};

	const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newDate = dayjs(event.target.value, 'YYYY-MM-DD');
		setEndDate(newDate);
		setRange([range[0], newDate.unix()]);
	};

	return (
		<div className="flex flex-col justify-center">
			<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">{title}</h3>

			<Slider
				value={range}
				sx={{
					width: 300,
					color: '#0284c7',
					'& .MuiSlider-thumb': {
						height: 24,
						width: 24,
						backgroundColor: '#fff',
						border: '2px solid currentColor',
						'&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
							boxShadow: 'inherit',
						},
						'&::before': {
							display: 'none',
						},
					},
				}}
				onChange={handleSliderChange}
				min={minTimestamp}
				max={maxTimestamp}
				valueLabelDisplay="auto"
				valueLabelFormat={(value) => dayjs(value * 1000).format('YYYY-MM-DD')}
				marks={[
					{ value: minTimestamp, label: dayjs(minTimestamp * 1000).format('YYYY') },
					{ value: maxTimestamp, label: dayjs(maxTimestamp * 1000).format('YYYY') },
				]}
				className="w-full"
			/>

			<div className="flex justify-between items-center mt-6 space-x-3">
				<TextField
					label="Start Date"
					type="date"
					size="small"
					value={startDate.format('YYYY-MM-DD')}
					onChange={handleStartDateChange}
					className="flex-grow border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>

				<TextField
					size="small"
					label="End Date"
					type="date"
					value={endDate.format('YYYY-MM-DD')}
					onChange={handleEndDateChange}
					className="flex-grow border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

				/>
			</div>

	{/* Algolia Configure Component for filtering */
	}
	<Configure filters={filterString} />
</div>
)
	;
};

export default DateRangeSlider;