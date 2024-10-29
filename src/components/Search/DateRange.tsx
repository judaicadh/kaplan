import React, { useState, useEffect } from 'react';
import { useRange } from 'react-instantsearch';
import { Range } from 'react-range';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { liteClient as algoliasearch } from 'algoliasearch/lite';


const searchClient = algoliasearch('ZLPYTBTZ4R', 'be46d26dfdb299f9bee9146b63c99c77');
const index = "Dev_Kaplan";

interface CustomRangeInputProps {
	attribute: ;
}

const CustomRangeInput: React.FC<CustomRangeInputProps> = ({ attribute }) => {
	const { start, range, canRefine, refine } = useRange({ attribute });
	const [values, setValues] = useState<[number, number]>([
		start[0] ?? range.min ?? 0,
		start[1] ?? range.max ?? Math.floor(Date.now() / 1000),
	]);
	const [histogramData, setHistogramData] = useState<{ date: number; count: number }[]>([]);

	useEffect(() => {
		// Fetch histogram data from Algolia
		const fetchHistogramData = async () => {
			const response = await index.search({
				query: '',
				facets: [attribute],
				maxValuesPerFacet: 100,
			});

			const buckets = response.facets?.[attribute] || {};
			const data = Object.keys(buckets).map((timestamp) => ({
				date: new Date(parseInt(timestamp, 10) * 1000).getFullYear(),
				count: buckets[timestamp],
			}));

			setHistogramData(data);
		};

		fetchHistogramData();
	}, [attribute]);

	return (
		<div>
			<h3>Filter by Date</h3>

			{/* Histogram */}
			<ResponsiveContainer width="100%" height={100}>
				<BarChart data={histogramData}>
					<XAxis dataKey="date" />
					<YAxis />
					<Tooltip />
					<Bar dataKey="count" fill="#00aaff" />
				</BarChart>
			</ResponsiveContainer>

			{/* Range Slider */}
			<Range
				values={values}
				step={86400} // Step by one day (in seconds)
				min={range.min ?? 0}
				max={range.max ?? Math.floor(Date.now() / 1000)}
				onChange={(newValues) => setValues(newValues as [number, number])}
				onFinalChange={(newValues) => refine(newValues as [number, number])}
				renderTrack={({ props, children }) => (
					<div
						{...props}
						style={{
							...props.style,
							height: '6px',
							background: '#ddd',
							borderRadius: '3px',
							position: 'relative',
						}}
					>
						{children}
					</div>
				)}
				renderThumb={({ props }) => (
					<div
						{...props}
						style={{
							...props.style,
							height: '24px',
							width: '24px',
							backgroundColor: '#00aaff',
							borderRadius: '50%',
						}}
					/>
				)}
			/>

			{/* Display Selected Date Range */}
			<div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
				<span>{new Date(values[0] * 1000).toLocaleDateString()}</span>
				<span>{new Date(values[1] * 1000).toLocaleDateString()}</span>
			</div>
		</div>
	);
};

export default CustomRangeInput;