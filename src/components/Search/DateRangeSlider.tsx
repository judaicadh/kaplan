import React, { useState, useEffect } from "react";
import { Configure } from 'react-instantsearch';
import Slider from '@mui/material/Slider';
import { TextField } from "@mui/material";
import dayjs from "dayjs";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";

type CombinedDateRangeSliderProps = {
	minTimestamp: number;
	maxTimestamp: number;
	dateFields: string[];
	title: string;
	onDateChange?: (isActive: boolean) => void;

	value?: { min: number; max: number }; // externally controlled value
	onChange?: (newValue: { min: number; max: number }) => void; // external change handler
};

const DateRangeSlider: React.FC<CombinedDateRangeSliderProps> = ({
																																	 minTimestamp,
																																	 maxTimestamp,
																																	 dateFields,
																																	 title,
																																	 onDateChange,
																																	 value,
																																	 onChange
																																 }) => {
	const isControlled = value !== undefined;
	const [internalRange, setInternalRange] = useState<[number, number]>([minTimestamp, maxTimestamp]);
	const range = isControlled ? [value!.min, value!.max] : internalRange;

	const [filterString, setFilterString] = useState<string>('');
	const [startDate, setStartDate] = useState<string>(dayjs(range[0] * 1000).format("YYYY"));
	const [endDate, setEndDate] = useState<string>(dayjs(range[1] * 1000).format("YYYY"));

	const updateRange = (newRange: [number, number]) => {
		if (!isControlled) setInternalRange(newRange);
		onChange?.({ min: newRange[0], max: newRange[1] });
		setStartDate(dayjs(newRange[0] * 1000).format("YYYY"));
		setEndDate(dayjs(newRange[1] * 1000).format("YYYY"));
	};

	useEffect(() => {
		const isActive = range[0] !== minTimestamp || range[1] !== maxTimestamp;
		onDateChange?.(isActive);

		const singleCondition = `(${dateFields[0]} <= ${range[1]} AND ${dateFields[1]} >= ${range[0]})`;
		setFilterString(singleCondition);

		const updateURL = setTimeout(() => {
			const url = new URL(window.location.href);
			range[0] !== minTimestamp
				? url.searchParams.set("start", dayjs(range[0] * 1000).format("YYYY"))
				: url.searchParams.delete("start");
			range[1] !== maxTimestamp
				? url.searchParams.set("end", dayjs(range[1] * 1000).format("YYYY"))
				: url.searchParams.delete("end");
			window.history.replaceState(null, '', url.toString());
		}, 500);

		return () => clearTimeout(updateURL);
	}, [range, minTimestamp, maxTimestamp, dateFields]);

	const handleSliderChange = (_: Event, newValue: number | number[]) => {
		if (Array.isArray(newValue)) {
			updateRange([newValue[0], newValue[1]]);
		}
	};

	const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setStartDate(value);
		const year = parseInt(value, 10);
		if (!isNaN(year)) {
			const newStart = dayjs().year(year).startOf("year").unix();
			if (newStart >= minTimestamp && newStart <= range[1]) {
				updateRange([newStart, range[1]]);
			}
		}
	};

	const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setEndDate(value);
		const year = parseInt(value, 10);
		if (!isNaN(year)) {
			const newEnd = dayjs().year(year).endOf("year").unix();
			if (newEnd <= maxTimestamp && newEnd >= range[0]) {
				updateRange([range[0], newEnd]);
			}
		}
	};

	return (
		<div className="bg-white px-4 dark:bg-gray-900">
			<Disclosure defaultOpen={true}>
				{({ open }) => (
					<>
						<DisclosureButton
							className="flex w-full justify-between items-center py-3 text-left text-gray-900 dark:text-gray-100 font-medium border-b border-gray-200 dark:border-gray-700">
							<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
							{open ? (
								<ChevronUpIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
							) : (
								<ChevronDownIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
							)}
						</DisclosureButton>

						<DisclosurePanel className="pt-3 px-4">
							<Slider
								getAriaLabel={(index) => `Date range slider thumb ${index + 1}`}
								value={range}
								min={minTimestamp}
								max={maxTimestamp}
								onChange={handleSliderChange}
								valueLabelDisplay="auto"
								valueLabelFormat={(value) => dayjs(value * 1000).format('YYYY')}
								marks={[
									{ value: minTimestamp, label: dayjs(minTimestamp * 1000).format('YYYY') },
									{ value: maxTimestamp, label: dayjs(maxTimestamp * 1000).format("YYYY") }
								]}
								sx={{
									width: '100%',
									color: '#0284c7',
									'& .MuiSlider-thumb': {
										height: 24,
										width: 24,
										backgroundColor: "#fff"
									},
								}}
							/>

							<div className="flex justify-between space-x-4 mt-4">
								<TextField
									aria-label="Start date"
									value={startDate}
									onChange={handleStartDateChange}
									label="Start Year"
									variant="outlined"
								/>
								<TextField
									aria-label="End date"
									value={endDate}
									onChange={handleEndDateChange}
									label="End Year"
									variant="outlined"
								/>
							</div>

							{filterString && <Configure filters={filterString} />}
						</DisclosurePanel>
					</>
				)}
			</Disclosure>
		</div>
	);
};

export default DateRangeSlider;