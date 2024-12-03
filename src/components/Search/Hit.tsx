import React, { useState, useEffect } from 'react'
import type { Hit as AlgoliaHit } from 'instantsearch.js/es/types';
import Typography from '@mui/material/Typography'
import { Card, CardActionArea, CardActions, CardContent, CardMedia, IconButton } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

type HitProps = {
	hit: AlgoliaHit<{
		objectID: string;
		name: string;
		type: string[];
		categories: string[];
		subtype: string[];
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

export function Hit({ hit, sendEvent }: HitProps) {
	const [isFavorite, setIsFavorite] = useState(false)

	// Load favorites from local storage
	useEffect(() => {
		const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
		setIsFavorite(favorites.some((fav: { objectID: string }) => fav.objectID === hit.objectID))
	}, [hit.objectID])

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
	}

	const handleClick = () => {
		sendEvent('click', 'Item Clicked', {
			objectID: hit.objectID,
			eventName: 'Item Clicked',
		});
	};

	return (
		<Card className="max-w-[180px] shadow-md transition hover:shadow-lg relative">
			<a href={`/item/${hit.slug}`} onClick={handleClick} style={{ textDecoration: 'none' }}>
				<CardActionArea>
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
						</Typography>
					</CardContent>
					<CardActions disableSpacing>
						<IconButton
							onClick={(e) => {
								e.preventDefault() // Prevents navigation when clicking the favorite icon
								toggleFavorite()
							}}
							className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
							aria-label="favorite"
						>
							{isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
						</IconButton>
					</CardActions>
				</CardActionArea>
			</a>

			{/* Favorite Button */}

		</Card>
	);
}