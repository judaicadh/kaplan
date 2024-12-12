import React, { useState, useEffect } from 'react'
import type { Hit as AlgoliaHit } from 'instantsearch.js/es/types';
import Typography from '@mui/material/Typography'
import { Card, CardActionArea, CardActions, CardContent, CardMedia } from '@mui/material'
import FavoritesButton from '@components/Misc/FavoritesButton.tsx'

type HitProps = {
	hit: AlgoliaHit<{
		objectID: string;
		name: string;
		type: string[];
		categories: string[];
		subtype: string[];
		topic: string[];
		dateC: string;
		description: string;
		title: string;
		geography: string[];
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

function getTopicClass(topic) {
	return topicColors[topic] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' // Default color
}

function TopicBadges({ hit }: { hit: HitProps['hit'] }) {
	return (
		<div className="flex flex-wrap gap-2 mt-2">
			{hit.topic.map((t, index) => (
				<span
					key={index}
					className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getTopicClass(t)}`}
				>
          {t}
        </span>
			))}
		</div>
	);
}

export function Hit({ hit, sendEvent }: HitProps) {
	const [isFavorite, setIsFavorite] = useState(false)

	const updateFavoriteState = () => {
		const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
		setIsFavorite(favorites.some((fav: { objectID: string }) => fav.objectID === hit.objectID))
	}

	useEffect(() => {
		// Initialize the favorite state
		updateFavoriteState()

		// Listen for the custom event to update the state
		const handleFavoritesUpdated = () => updateFavoriteState()
		window.addEventListener('favoritesUpdated', handleFavoritesUpdated)

		// Cleanup listener
		return () => window.removeEventListener('favoritesUpdated', handleFavoritesUpdated)
	}, [hit.objectID]);

	const toggleFavorite = () => {
		const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')

		if (isFavorite) {
			const updatedFavorites = favorites.filter((fav: { objectID: string }) => fav.objectID !== hit.objectID)
			localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
			setIsFavorite(false)
		} else {
			favorites.push(hit)
			localStorage.setItem('favorites', JSON.stringify(favorites))
			setIsFavorite(true)
		}

		// Dispatch a custom event to notify other components
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
		<Card className="max-w-[180px] shadow-md transition hover:shadow-lg relative">
			<CardActionArea onClick={handleClick} href={`/item/${hit.slug}`} component="a">
				<CardMedia
					component="img"
					sx={{ height: 180, objectFit: 'contain' }}
					image={hit.thumbnail}
					alt={hit.title}
					className="rounded-t-md"
				/>
				<CardContent className="p-3">
					<Typography
						variant="subtitle2"
						sx={{ color: 'text.primary', fontWeight: 600, fontSize: 12 }}
						className="line-clamp-3"
					>
						{hit.title}
					</Typography>

					<Typography
						variant="caption"
						className="text-sm text-gray-600 mt-1"
						color="textSecondary"
					>
						<strong>{hit.type}</strong> - {hit.dateC}
						<TopicBadges hit={hit} />
					</Typography>
				</CardContent>
			</CardActionArea>

			<CardActions disableSpacing>
				<FavoritesButton
					objectID={hit.objectID}
					title={hit.title}
					slug={hit.slug}
					thumbnail={hit.thumbnail}
				/>
			</CardActions>
		</Card>
	);
}