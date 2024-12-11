import React, { useState, useEffect } from 'react'

type FavoritesIconProps = {};

const FavoritesIcon: React.FC<FavoritesIconProps> = () => {
	const [favoritesCount, setFavoritesCount] = useState(0)

	// Update the count from localStorage
	const updateFavoritesCount = () => {
		const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
		setFavoritesCount(favorites.length)
	}

	useEffect(() => {
		// Initialize the count
		updateFavoritesCount()

		// Listen for updates
		const handleFavoritesUpdate = () => updateFavoritesCount()
		window.addEventListener('favoritesUpdated', handleFavoritesUpdate)

		// Cleanup listener
		return () => window.removeEventListener('favoritesUpdated', handleFavoritesUpdate)
	}, [])

	return (
		<>
			<a href="/favorites"
				 type="button"
				 className="relative inline-flex items-center sm:m-3 p-3 text-sm font-medium text-center text-white bg-indigo-700
				rounded-lg hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:bg-indigo-600
				dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">
				<svg aria-hidden="true"
						 xmlns="http://www.w3.org/2000/svg"
						 fill="currentColor"
						 viewBox="0 0 24 24"
						 className="w- h-6  "
				>
					<path
						d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
				</svg>

				<span className="sr-only">Notifications</span>
				{favoritesCount > 0 && (
					<div
						className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">
						{favoritesCount}
					</div>
				)}

			</a>
		</>
	)

}

export default FavoritesIcon