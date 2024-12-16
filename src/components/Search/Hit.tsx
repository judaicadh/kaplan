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
	const [isFavorite, setIsFavorite] = useState(false)

	// Utility function for managing favorites
	const manageFavorites = useCallback(() => {
		const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
		return {
			isFavorite: favorites.some((fav: { objectID: string }) => fav.objectID === hit.objectID),
			updateFavorites: (action: 'add' | 'remove') => {
				const updatedFavorites =
					action === 'add'
						? [...favorites, hit]
						: favorites.filter((fav: { objectID: string }) => fav.objectID !== hit.objectID)
				localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
				return updatedFavorites
			}
		}
	}, [hit])

	// Initialize favorite state and set up listener
	useEffect(() => {
		const { isFavorite } = manageFavorites()
		setIsFavorite(isFavorite)

		const handleFavoritesUpdated = () => {
			const { isFavorite } = manageFavorites()
			setIsFavorite(isFavorite)
		}

		window.addEventListener('favoritesUpdated', handleFavoritesUpdated)
		return () => window.removeEventListener('favoritesUpdated', handleFavoritesUpdated)
	}, [hit.objectID, manageFavorites]);

	const toggleFavorite = () => {
		const action = isFavorite ? 'remove' : 'add'
		manageFavorites().updateFavorites(action)
		setIsFavorite(!isFavorite)

		// Dispatch event
		const event = new Event('favoritesUpdated')
		window.dispatchEvent(event)
	};

	const handleClick = () => {
		sendEvent('click', 'Item Clicked', {
			objectID: hit.objectID,
			eventName: 'Item Clicked',
		});
	};


	return (
		<Card className="shadow-md hover:shadow-lg transition rounded-md">
			{/* Image and Title Section */}
			<CardActionArea
				onClick={handleClick}
				href={`/item/${hit.slug}`}
				component="a"
				aria-label={`View details for ${hit.title || 'Untitled'}`}
			>
				<CardMedia
					component="img"
					sx={{ height: 180, objectFit: 'contain' }}
					image={hit.thumbnail || '/placeholder.png'}
					alt={hit.title || 'No title available'}
				/>
				<CardContent className="p-3 text-center">
					<Typography
						variant="body2"
						sx={{ fontWeight: 'bold', fontSize: 14, color: 'text.primary' }}
						className="line-clamp-2"
					>
						{hit.title || 'Untitled'}
					</Typography>
				</CardContent>
			</CardActionArea>

			<Divider />

			{/* Topics and Favorite Button Row */}
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
				{/* Topic Badges */}
				<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
					<TopicBadges hit={hit} />
				</Box>

				{/* Favorites Button */}
				<Box>
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