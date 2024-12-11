import React from 'react'
import { ButtonGroup, IconButton } from '@mui/material'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import ShareRoundedIcon from '@mui/icons-material/ShareRounded'
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded'
import TwitterIcon from '@mui/icons-material/Twitter'
import EmailRoundedIcon from '@mui/icons-material/Email'

const ActionBar: React.FC = () => {
	const handleFavorite = () => {
		console.log('Added to favorites!')
	}

	const handleShare = (platform: string) => {
		switch (platform) {
			case 'facebook':
				window.open('https://www.facebook.com/sharer/sharer.php?u=' + window.location.href, '_blank')
				break
			case 'twitter':
				window.open('https://twitter.com/intent/tweet?url=' + window.location.href, '_blank')
				break
			case 'email':
				window.open(`mailto:?subject=Check this out&body=${window.location.href}`, '_self')
				break
			default:
				console.log('Share button clicked!')
		}
	}


	return (
		<div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
			<ButtonGroup variant="outlined" size="medium">
				{/* Favorite Button */}
				<IconButton color="primary" onClick={handleFavorite} title="Add to Favorites">
					<FavoriteBorderRoundedIcon />
				</IconButton>

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
	)
}

export default ActionBar