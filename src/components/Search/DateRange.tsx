import React, { useState, useEffect } from 'react';
import { Configure } from 'react-instantsearch';
import Slider from '@mui/material/Slider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Datepicker from 'react-tailwindcss-datepicker';
import { fromUnixTime } from 'date-fns'

type CombinedDateRangeSliderProps = {
	minTimestamp: number;
	maxTimestamp: number;
	dateFields: string[];
};

type DateRangeType = {
	startDate: Date | null;
	endDate: Date | null;
};

const DateRangeSlider: React.FC<CombinedDateRangeSliderProps> = ({
																																	 minTimestamp,
																																	 maxTimestamp,
																																	 dateFields,
																																 }) => {
	const [range, setRange] = useState<[number, number]>([minTimestamp, maxTimestamp]);
	const [filterString, setFilterString] = useState<string>('');
	const [dateRange, setDateRange] = useState<DateRangeType>({
		startDate: new Date(minTimestamp * 1000),
		endDate: new Date(maxTimestamp * 1000),
	});

	useEffect(() => {
		const singleCondition = `(${dateFields[0]} <= ${range[1]} AND ${dateFields[1]} >= ${range[0]})`;
		setFilterString(singleCondition);
	}, [range, dateFields]);

	const handleSliderChange = (event: Event, newValue: number | number[]) => {
		if (Array.isArray(newValue)) {
			setRange([newValue[0], newValue[1]]);
			setDateRange({
				startDate: new Date(newValue[0] * 1000),
				endDate: new Date(newValue[1] * 1000),
			});
		}
	};

	const handleDateChange = (newValue: DateRangeType | null) => {
		if (newValue && newValue.startDate && newValue.endDate) {
			const start = typeof newValue.startDate === 'string' ? new Date(newValue.startDate) : newValue.startDate;
			const end = typeof newValue.endDate === 'string' ? new Date(newValue.endDate) : newValue.endDate;

			setDateRange({ startDate: start, endDate: end });
			const newRange: [number, number] = [
				Math.floor(start.getTime() / 1000),
				Math.floor(end.getTime() / 1000),
			];
			setRange(newRange);
		}
	};

	// Define 19th-century shortcuts


	return (
		<Grid container spacing={2} direction="column" alignItems="center">


			<Slider
				value={range}
				onChange={handleSliderChange}
				min={minTimestamp}
				max={maxTimestamp}
				valueLabelDisplay="on"
				valueLabelFormat={(value) => new Date(value * 1000).toISOString().split('T')[0]}
				className="w-full max-w-xs sm:max-w-md"
			/>

			<div className="mt-4 w-full max-w-xs sm:max-w-md relative z-50">
				<Datepicker
					primaryColor={"sky"}
					separator="to"
					startFrom={new Date(minTimestamp * 1000)}
					value={{
						startDate: dateRange.startDate,
						endDate: dateRange.endDate,
					}}
					onChange={(newValue) => handleDateChange(newValue)}




					inputClassName="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white w-full"

					showShortcuts={true}
					configs={{
						shortcuts: [
							{
								text: '1800s',
								period: {
									start: (new Date("1800-01-01")),
									end: (new Date( "1899-12-31"))
								},
							},
							{
								text: '1810s',
								period: {
									start: new Date("1810-01-01"),
									end:new Date( "1819-12-31")
								},
							},
							{
								text: '1820s',
								period: {
									start: new Date("1820-01-01"),
									end: new Date("1829-12-31")
								},
							},
							{
								text: '1830s',
								period: {
									start: new Date("1830-01-01"),
									end: new Date("1839-12-31")
								},
							},
							{
								text: '1840s',
								period: {
									start: new Date("1840-01-01"),
									end: new Date("1849-12-31")
								},
							},
							{
								text: '1850s',
								period: {
									start: new Date("1850-01-01"),
									end: new Date("1859-12-31")
								},
							},
							{
								text: '1860s',
								period: {
									start: new Date("1860-01-01"),
									end: new Date("1869-12-31")
								},
							},
							{
								text: '1870s',
								period: {
									start: new Date("1870-01-01"),
									end: new Date("1879-12-31")
								},
							},
							{
								text: '1880s',
								period: {
									start: new Date("1880-01-01"),
									end: new Date("1889-12-31")
								},
							},
							{
								text: '1890s',
								period: {
									start:new Date("1890-01-01"),
									end: new Date("1899-12-31")
								},
							}
						]

					}}
				/>
			</div>

			<Configure filters={filterString} />
		</Grid>
	);
};

export default DateRangeSlider;