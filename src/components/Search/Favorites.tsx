import React, { useState, useEffect } from 'react'
import { Card, CardActionArea, CardActions, CardContent, CardMedia, Tooltip, Typography } from '@mui/material'
import FavoritesButton from '@components/Misc/FavoritesButton.tsx'

type Favorite = {
	objectID: string;
	name: string;
	type: string[];
	topic: string[];
	categories: string[];
	subtype: string[];
	dateC: string;
	description: string;
	title: string;
	geography: string[];
	thumbnail: string;
	slug: string;
	url?: string;
};
const topicColors = {
	Mercantile: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
	Religious: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
	Personal: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300',
	'Arts & Professions': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
	Military: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
}
function getTopicClass(topic) {
	return topicColors[topic] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' // Default color
}

function TopicBadges({ favorite }) {
	return (
		<div className="flex flex-wrap gap-2">
			{favorite.topic.map((t, index) => (
				<span
					key={index}
					className={`text-xs font-medium px-2.5 py-0.5 rounded-full truncate max-w-[8rem] ${getTopicClass(t)}`}
				>
          {t}
        </span>
			))}
		</div>
	);
}
const Favorites = () => {
	const [favorites, setFavorites] = useState<Favorite[]>([])

	useEffect(() => {
		// Retrieve favorites from localStorage
		const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]') as Favorite[]
		setFavorites(storedFavorites)
	}, []);

	return (
		<div className="pb-20 px-7">

		{favorites.length === 0 ? (
				<div className="text-center mt-10">

					<Typography variant="body1">You have no favorites yet. Start adding some and they will appear
						here!</Typography>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{favorites.map((favorite) => (
						<Card key={favorite.objectID} className="shadow-md transition hover:shadow-lg">
							<CardActionArea
								href={`/item/${favorite.slug}`}
								component="a"
								style={{ textDecoration: 'none' }}
							>
								<CardMedia
									component="img"
									sx={{ height: 180, objectFit: 'contain' }}
									image={favorite.thumbnail || 'https://placehold.co/600x600.jpg?text=Image+Coming+Soon'}
									alt={favorite.title || 'Favorite item'}
									className="rounded-t-md"
								/>
								<CardContent className="p-3">
									<Typography
										variant="subtitle2"
										sx={{ color: 'text.primary', fontWeight: 600, fontSize: 12 }}
										className="line-clamp-3"
									>
										{favorite.title || 'Untitled'}

									</Typography>

								</CardContent>
							</CardActionArea>
							<CardActions disableSpacing>
								<Tooltip title="Favorite Item">
								<FavoritesButton
									client:only="react"
									objectID={favorite.objectID}
									title={favorite.title}
									slug={favorite.slug}
									thumbnail={favorite.thumbnail}
								/>
								</Tooltip>
							</CardActions>
						</Card>
					))}
				</div>
			)}
		</div>
	);
};

export default Favorites