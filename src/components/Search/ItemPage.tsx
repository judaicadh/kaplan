import React, { useState, useEffect } from 'react'
import { ButtonGroup, IconButton } from '@mui/material'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import ShareRoundedIcon from '@mui/icons-material/ShareRounded'
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded'
import TwitterIcon from '@mui/icons-material/Twitter'
import EmailRoundedIcon from '@mui/icons-material/Email'
import FavoritesButton from '@components/Misc/FavoritesButton.tsx' // Import the reusable FavoritesButton component

type ActionBarProps = {
	objectID: string;
	title: string;
	slug: string;
	thumbnail: string;
};

const ActionBar: React.FC<ActionBarProps> = ({ objectID, title, slug, thumbnail }) => {
	const handleShare = (platform: string) => {
		const url = window.location.href

		switch (platform) {
			case 'facebook':
				window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
				break
			case 'twitter':
				window.open(`https://twitter.com/intent/tweet?url=${url}`, '_blank')
				break
			case 'email':
				window.open(`mailto:?subject=Check this out&body=${url}`, '_self')
				break
			default:
				console.log('Share button clicked!')
		}
	};

	return (
		<div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
			<ButtonGroup variant="outlined" size="medium">
				{/* Favorite Button */}
				<FavoritesButton
					objectID={objectID}
					title={title}
					slug={slug}
					thumbnail={thumbnail}
				/>

				{/* Share Button */}
				<IconButton color="primary" title="Share">
					<ShareRoundedIcon />
				</IconButton>

				{/* Share to Facebook */}
				<IconButton
					color="primary"
					onClick={() => handleShare('facebook')}
					title="Share on Facebook"
				>
					<FacebookRoundedIcon />
				</IconButton>

				{/* Share to Twitter */}
				<IconButton
					color="primary"
					onClick={() => handleShare('twitter')}
					title="Share on Twitter"
				>
					<TwitterIcon />
				</IconButton>

				{/* Share via Email */}
				<IconButton
					color="primary"
					onClick={() => handleShare('email')}
					title="Share via Email"
				>
					<EmailRoundedIcon />
				</IconButton>
			</ButtonGroup>
		</div>
	);
};

export default ActionBar