import React, { useState, useEffect } from 'react'
import IconButton from '@mui/material/IconButton'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'

type FavoritesButtonProps = {
	objectID: string;
	title: string;
	slug: string;
	thumbnail: string;
};

const FavoritesButton: React.FC<FavoritesButtonProps> = ({ objectID, title, slug, thumbnail }) => {
	const [isFavorite, setIsFavorite] = useState(false)

	const updateFavoriteState = () => {
		const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
		setIsFavorite(favorites.some((fav: { objectID: string }) => fav.objectID === objectID))
	}

	useEffect(() => {
		// Initialize the favorite state
		updateFavoriteState()

		// Listen for the custom event to update the state
		const handleFavoritesUpdated = () => updateFavoriteState()
		window.addEventListener('favoritesUpdated', handleFavoritesUpdated)

		// Cleanup listener
		return () => window.removeEventListener('favoritesUpdated', handleFavoritesUpdated)
	}, [objectID]);

	const toggleFavorite = (e: React.MouseEvent) => {
		e.stopPropagation() // Prevent event propagation to parent elements
		const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')

		if (isFavorite) {
			// Remove from favorites
			const updatedFavorites = favorites.filter((fav: { objectID: string }) => fav.objectID !== objectID)
			localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
			setIsFavorite(false)
		} else {
			// Add to favorites
			favorites.push({ objectID, title, slug, thumbnail })
			localStorage.setItem('favorites', JSON.stringify(favorites))
			setIsFavorite(true)
		}

		// Dispatch the `favoritesUpdated` event
		const event = new Event('favoritesUpdated')
		window.dispatchEvent(event)
	};

	return (
		<IconButton color="primary" onClick={toggleFavorite} title="Toggle Favorite">
			{isFavorite ? <FavoriteRoundedIcon color="error" /> : <FavoriteBorderRoundedIcon />}
		</IconButton>
	);
};

export default FavoritesButton