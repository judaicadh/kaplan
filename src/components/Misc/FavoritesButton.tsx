import React, { useState, useEffect } from 'react'
import IconButton from '@mui/material/IconButton'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import { Tooltip } from '@mui/material'

type FavoritesButtonProps = {
	slug: string;
	title: string;
	thumbnail?: string;
	/** Optional: Algolia objectID for analytics */
	objectID?: string;
	/** Optional: notify parent/UI/analytics */
	onToggle?: (nextIsFavorite: boolean, payload: {
		slug: string; title: string; thumbnail?: string; objectID?: string;
	}) => void;
};

const FavoritesButton: React.FC<FavoritesButtonProps> = ({
																													 slug, title, thumbnail, objectID, onToggle
																												 }) => {
	const [isFavorite, setIsFavorite] = useState(false);

	useEffect(() => {
		// guard for SSR just in case
		if (typeof window === 'undefined') return;
		const update = () => {
			const raw = localStorage.getItem('favorites') || '[]';
			const favorites: Array<{ slug: string }> = JSON.parse(raw);
			setIsFavorite(favorites.some(f => f.slug === slug));
		};
		update();
		window.addEventListener('favoritesUpdated', update);
		return () => window.removeEventListener('favoritesUpdated', update);
	}, [slug]);

	const toggleFavorite = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		const raw = localStorage.getItem('favorites') || '[]';
		let favorites: Array<{ slug: string; title: string; thumbnail?: string; objectID?: string }> = JSON.parse(raw);

		let next = false;
		if (isFavorite) {
			favorites = favorites.filter(f => f.slug !== slug);
			next = false;
		} else {
			favorites.push({ slug, title, thumbnail, objectID });
			next = true;
		}

		localStorage.setItem('favorites', JSON.stringify(favorites));
		setIsFavorite(next);

		// notify UI
		window.dispatchEvent(new Event('favoritesUpdated'));
		onToggle?.(next, { slug, title, thumbnail, objectID });

		// optional: push to GTM
		if ((window as any).dataLayer) {
			(window as any).dataLayer.push({
				event: next ? 'favorite_add' : 'favorite_remove',
				favorite: { slug, title, objectID }
			});
		}
	};

	return (
		<Tooltip title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}>
			<IconButton
				color="primary"
				onClick={toggleFavorite}
				aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
				aria-pressed={isFavorite}
				size="small"
			>
				{isFavorite ? <FavoriteRoundedIcon color="error" /> : <FavoriteBorderRoundedIcon />}
			</IconButton>
		</Tooltip>
	);
};

export default FavoritesButton;