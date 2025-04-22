import React, { useState, useEffect, useCallback, useMemo } from 'react'
import type { Hit as AlgoliaHit } from 'instantsearch.js/es/types';
import Typography from '@mui/material/Typography'
import { Box, Card, CardActionArea, CardActions, CardContent, CardMedia, Chip, Divider, Stack } from '@mui/material'
import FavoritesButton from '@components/Misc/FavoritesButton.tsx'

type HitProps = {
	hit: AlgoliaHit<{
		objectID: string;
		startDate1: number;
		endDate1: number;
		name: string;
		personAI: string;
		businessAI: string;
		type: string[];
		subtype: string;
		topic: string[];
		dateC: string;
		description: string;
		title: string;
		geographic_subject: string[];
		thumbnail: string;
		slug: string;
		url?: string;
		hierarchicalCategories: {
			lvl0: string[];
			lvl1: string[];
			lvl2: string[];
		};
		hasRealThumbnail: boolean;
		subject: string[];
		_geoloc?: {
			lat: number | number[];
			lng: number | number[];
		};
	}>;
	sendEvent: (eventType: string, eventName: string, eventData?: object) => void;
};

const topicColors = {
	Mercantile: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
	Religious: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
	Personal: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300',
	'Arts & Professions': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
	Military: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
};

const getTopicClass = (topic: string) => {
	return topicColors[topic] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' // Default color
}
function TopicBadges({ hit }: { hit: HitProps['hit'] }) {
	return (
		<>
			{hit.topic.map((t, index) => (
				<span
					key={index}
					className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getTopicClass(t)}`}
				>
          {t}
        </span>
			))}
		</>
	);
}

export function Hit({ hit, sendEvent }: HitProps) {
	const handleClick = () => {
		sendEvent('click', 'Item Clicked', {
			objectID: hit.objectID,
			eventName: 'Item Clicked',
		});
	};

	return (
		<Card
			className="rounded-2xl shadow-sm hover:shadow-lg transition-transform hover:scale-[1.01] bg-white dark:bg-gray-800 w-full">
			<CardActionArea
				onClick={handleClick}
				href={`/item/${hit.slug}`}
				component="a"
				aria-label={`View details for ${hit.title || 'Untitled'}`}
			>
				<CardMedia
					component="img"
					sx={{
						height: 180,
						objectFit: "contain",
						borderBottom: "1px solid #e5e7eb",
						backgroundColor: "#f9fafb",
						display: "block",           // Ensures it's block-level
						marginLeft: "auto",         // Centers horizontally
						marginRight: "auto",        // Centers horizontally
						padding: "0.5rem",          // Optional: adds some spacing around image
						maxWidth: "100%"           // Prevents overflow
					}}
					image={hit.thumbnail || '/placeholder.png'}
					alt={hit.title || 'No title available'}
				/>
				<CardContent className="p-3 text-center">
					<Typography
						variant="body2"
						className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white"
					>
						{hit.title || 'Untitled'}
					</Typography>
				</CardContent>
			</CardActionArea>

			<Divider />

			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
				<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
					<TopicBadges hit={hit} />
				</Box>

				<Box className="flex items-center gap-2">
					<FavoritesButton
						objectID={hit.objectID}
						title={hit.title}
						slug={hit.slug}
						thumbnail={hit.thumbnail}
					/>
				</Box>
			</Box>
		</Card>
	);
}

export default Hit