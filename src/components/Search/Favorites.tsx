import React, { useState, useEffect } from 'react'
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material'

type Favorite = {
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
};

const Favorites = () => {
	const [favorites, setFavorites] = useState<Favorite[]>([])

	useEffect(() => {
		// Retrieve favorites from localStorage
		const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]') as Favorite[]
		setFavorites(storedFavorites)
	}, [])

	return (
		<div className="p-6">
			<Typography variant="h4" className="mb-4" gutterBottom>
				Your Favorites
			</Typography>
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
											<strong>{favorite.type}</strong> - {favorite.dateC}
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