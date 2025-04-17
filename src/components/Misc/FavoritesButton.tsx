import React, { useState, useEffect } from 'react'
import IconButton from '@mui/material/IconButton'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import { Tooltip } from '@mui/material'

type FavoritesButtonProps = {
	slug: string;
	title: string;
	thumbnail: string;
};

const FavoritesButton: React.FC<FavoritesButtonProps> = ({ slug, title, thumbnail }) => {
	const [isFavorite, setIsFavorite] = useState(false)

	useEffect(() => {
		const updateFavoriteState = () => {
			const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
			setIsFavorite(favorites.some((fav: { slug: string }) => fav.slug === slug));
		};

		updateFavoriteState()
		window.addEventListener("favoritesUpdated", updateFavoriteState);

		return () => window.removeEventListener("favoritesUpdated", updateFavoriteState);
	}, [slug])

	const toggleFavorite = (e: React.MouseEvent) => {
		e.stopPropagation();
		let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

		if (isFavorite) {
			favorites = favorites.filter((fav: { slug: string }) => fav.slug !== slug);
			setIsFavorite(false)
		} else {
			favorites.push({ slug, title, thumbnail });
			setIsFavorite(true);
		}

		localStorage.setItem("favorites", JSON.stringify(favorites));
		window.dispatchEvent(new Event("favoritesUpdated"));
	}

	return (
		<Tooltip title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}>
			<IconButton
				color="primary"
				onClick={toggleFavorite}
				aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
				aria-pressed={isFavorite}
				size="small"
			>
				{isFavorite ? <FavoriteRoundedIcon color="error" /> : <FavoriteBorderRoundedIcon />}
			</IconButton>
		</Tooltip>
	)
}

export default FavoritesButton