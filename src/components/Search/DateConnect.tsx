import React, { useState, useEffect, useCallback } from 'react';
import { useRange } from 'react-instantsearch';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { format, fromUnixTime } from 'date-fns'


const dateToTimestamp = (dateString) => {
	const date = new Date(dateString);
	return isNaN(date.getTime()) ? null : Math.floor(date.getTime() / 1000);
};
const timestampToDate = (timestamp) => {
	if (timestamp === null || timestamp === undefined) return "";
	const date = new Date(timestamp * 1000);
	return date.toISOString().split('T')[0];
};

function CustomRangeSlider(props) {
	const { start, refine, range, canRefine } = useRange(props);

	const { min, max } = range  ;
	const [value, setValue] = React.useState(30);
	const [startValue, setStartValue] = useState(min ?? null);
	const [endValue, setEndValue] = useState(max ?? null);

	useEffect(() => {
		setStartValue(range.min ?? null);
		setEndValue(range.max ?? null);
	}, [range.min, range.max]);

	const handleSliderChange = useCallback((event, newValue) => {
		if (Array.isArray(newValue) && newValue.length === 2) {
			setStartValue(newValue[0]);
			setEndValue(newValue[1]);
		}
	}, []);

	const handleSliderValueCommit = useCallback((event, newValue) => {
		if (Array.isArray(newValue) && newValue.length === 2) {
			const [newStartValue, newEndValue] = newValue;
			if (newStartValue === null || newEndValue === null) return;
			refine([newStartValue, newEndValue]);
		}
	}, [refine]);

	const handleInputChange = (event, type) => {
		const dateValue = event.target.value;
		const newTimestamp = dateToTimestamp(dateValue);
		if (newTimestamp === null) return;

		let newStartValue = startValue;
		let newEndValue = endValue;

		if (type === 'start') {
			newStartValue = newTimestamp;
			setStartValue(newStartValue);
		} else {
			newEndValue = newTimestamp;
			setEndValue(newEndValue);
		}

		refine([newStartValue , newEndValue]);

	};

	return (
		<Box sx={{ width: 250 }}>


			<Grid container spacing={3} sx={{ alignItems: 'center' }}>

					<Grid item xs={12}>
			<Slider
				min={-15147284638}
				max={ -1731263330 }
				value={[startValue, endValue]}
				onChange={handleSliderChange}
				onChangeCommitted={handleSliderValueCommit}
				valueLabelDisplay="auto"
				valueLabelFormat={(value) => timestampToDate(value)}
				disabled={!canRefine}
				step={31556926}




			/>

				<Grid item>
					<input
						type="date"

						value={timestampToDate(startValue)}

 					/>
				</Grid>
						<Grid item>

							<input
								value={timestampToDate(endValue)}

								type="date"
								min={timestampToDate(startValue)}
								max={timestampToDate(endValue)}


							/>
						</Grid>
					</Grid>
			</Grid>
		</Box>

	);
}


export default CustomRangeSlider;