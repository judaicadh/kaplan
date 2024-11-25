import React, { useState, useEffect, useRef } from 'react'
import { Configure } from 'react-instantsearch';
import Slider from '@mui/material/Slider';
import { Input } from '@mui/material'
import dayjs, { Dayjs } from 'dayjs';

type CombinedDateRangeSliderProps = {
	minTimestamp: number;
	maxTimestamp: number;
	dateFields: string[];
	title: string;
};

const DateRangeSlider: React.FC<CombinedDateRangeSliderProps> = ({
																																	 minTimestamp,
																																	 maxTimestamp,
																																	 dateFields,
																																	 title,
																																 }) => {
	const [range, setRange] = useState<[number, number]>([minTimestamp, maxTimestamp]);
	const [filterString, setFilterString] = useState<string>('');
	const [startDate, setStartDate] = useState<string>(dayjs(minTimestamp * 1000).format('YYYY'))
	const [endDate, setEndDate] = useState<string>(dayjs(maxTimestamp * 1000).format('YYYY'))

	useEffect(() => {
		const singleCondition = `(${dateFields[0]} <= ${range[1]} AND ${dateFields[1]} >= ${range[0]})`;
		setFilterString(singleCondition);

		const updateURL = setTimeout(() => {
			const url = new URL(window.location.href);
			url.searchParams.set('start', startDate)
			url.searchParams.set('end', endDate)
			window.history.replaceState(null, '', url.toString());
		}, 500);

		return () => clearTimeout(updateURL);
	}, [range, startDate, endDate, dateFields]);

	const handleSliderChange = (event: Event, newValue: number | number[]) => {
		if (Array.isArray(newValue)) {
			setRange([newValue[0], newValue[1]]);
			setStartDate(dayjs(newValue[0] * 1000).format('YYYY'))
			setEndDate(dayjs(newValue[1] * 1000).format('YYYY'))
		}
	};

	const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value
		setStartDate(value)

		const year = parseInt(value, 10)
		if (!isNaN(year)) {
			const newDate = dayjs().year(year).startOf('year')
			if (newDate.unix() >= minTimestamp && newDate.unix() <= range[1]) {
				setRange([newDate.unix(), range[1]])
			}
		}
	};

	const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value
		setEndDate(value)

		const year = parseInt(value, 10)
		if (!isNaN(year)) {
			const newDate = dayjs().year(year).endOf('year')
			if (newDate.unix() <= maxTimestamp && newDate.unix() >= range[0]) {
				setRange([range[0], newDate.unix()])
			}
		}
	};

	const validateInput = (input: string, minYear: number, maxYear: number): string => {
		const year = parseInt(input, 10)
		if (isNaN(year) || year < minYear || year > maxYear) {
			return ''
		}
		return year.toString()
	};

	const handleBlurStartDate = () => {
		setStartDate((prev) => validateInput(prev, dayjs(minTimestamp * 1000).year(), dayjs(maxTimestamp * 1000).year()))
	};

	const handleBlurEndDate = () => {
		setEndDate((prev) => validateInput(prev, dayjs(minTimestamp * 1000).year(), dayjs(maxTimestamp * 1000).year()))
	};

	return (
		<div className="flex flex-col space-y-4 ">
			<h3 className="text-lg font-semibold text-gray-800">{title}</h3>
			<Slider
				value={range}
				min={minTimestamp}
				max={maxTimestamp}
				onChange={handleSliderChange}
				valueLabelDisplay="auto"
				valueLabelFormat={(value) => dayjs(value * 1000).format('YYYY')}
				marks={[
					{ value: minTimestamp, label: dayjs(minTimestamp * 1000).format('YYYY') },
					{ value: maxTimestamp, label: dayjs(maxTimestamp * 1000).format('YYYY') }
				]}
				sx={{
					width: '100%',
					color: '#0284c7',
					'& .MuiSlider-thumb': {
						height: 24,
						width: 24,
						backgroundColor: '#fff',
						border: '2px solid currentColor'
					},
				}}
			/>
			<div className="pt-4">
				<div className="flex justify-between space-x-4">
					<Input
						value={startDate}
						onChange={handleStartDateChange}
						onBlur={handleBlurStartDate}
						placeholder="Start Year"
					/>
					<Input
						value={endDate}
						onChange={handleEndDateChange}
						onBlur={handleBlurEndDate}
						placeholder="End Year"
					/>
				</div>
				{filterString && <Configure filters={filterString} />}
			</div>
		</div>
	);
};

export default DateRangeSlider