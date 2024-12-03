import React, { useState, useEffect } from 'react'
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material'

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
	Personal: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
	'Arts & Professions': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
	Military: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
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
					className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getTopicClass(t)}`}
				>
          {t}
        </span>
			))}
		</div>
	)
}
const Favorites = () => {
	const [favorites, setFavorites] = useState<Favorite[]>([])

	useEffect(() => {
		// Retrieve favorites from localStorage
		const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]') as Favorite[]
		setFavorites(storedFavorites)
	}, [])

	return (
		<div className="pb-20 px-7">
			<h4 className="mb-4 text-xl font-serif">
				Your Favorites
			</h4>
			{favorites.length === 0 ? (
				<Typography variant="body1">You have no favorites yet.</Typography>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{favorites.map((favorite) => (
						<Card key={favorite.objectID} className="shadow-md transition hover:shadow-lg">
							<a href={`/item/${favorite.slug}`} style={{ textDecoration: 'none' }}>
								<CardActionArea>
									<CardMedia
										component="img"
										sx={{ height: 180, objectFit: 'contain' }}
										image={favorite.thumbnail}
										alt={favorite.title}
										className="rounded-t-md"
									/>
									<CardContent className="p-3">
										<Typography
											variant="subtitle2"
											sx={{ color: 'text.primary', fontWeight: 600, fontSize: 12 }}
											className="line-clamp-3"
										>
											{favorite.title}
										</Typography>
										<Typography
											variant="caption"
											className="text-sm text-gray-600 mt-1"
											color="textSecondary"
										>
											<strong>{favorite.type}</strong> - {favorite.dateC}<br />
											<TopicBadges favorite={favorite} />

										</Typography>
									</CardContent>
								</CardActionArea>
							</a>
						</Card>
					))}
				</div>
			)}
		</div>
	)
}

export default Favorites