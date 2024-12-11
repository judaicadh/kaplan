// src/components/FavoriteButton.tsx
import React, { useState, useEffect } from 'react'
import IconButton from '@mui/material/IconButton'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

type FavoritesButtonProps = {
	objectID: string;
	title: string;
	slug: string;
	thumbnail: string;
};

const FavoritesButton: React.FC<FavoritesButtonProps> = ({ objectID, title, slug, thumbnail }) => {
	const [isFavorite, setIsFavorite] = useState(false)

	useEffect(() => {
		const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
		setIsFavorite(favorites.some((fav: { objectID: string }) => fav.objectID === objectID))
	}, [objectID])

	const toggleFavorite = () => {
		const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')

		if (isFavorite) {
			const updatedFavorites = favorites.filter((fav: { objectID: string }) => fav.objectID !== objectID)
			localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
			setIsFavorite(false)
		} else {
			favorites.push({ objectID, title, slug, thumbnail })
			localStorage.setItem('favorites', JSON.stringify(favorites))
			setIsFavorite(true)
		}
	}

	return (
		<IconButton
			onClick={toggleFavorite}
			aria-label="favorite"
			className="text-gray-500 hover:text-red-500"
		>
			{isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
		</IconButton>
	)
}

export default FavoritesButton