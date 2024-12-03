// Example: Adding an item to favorites
function addFavorite(item) {
	const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
	favorites.push(item)
	localStorage.setItem('favorites', JSON.stringify(favorites))

	// Emit a custom event
	window.dispatchEvent(new Event('favoritesUpdated'))
}

// Example: Removing an item from favorites
function removeFavorite(item) {
	const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
	const updatedFavorites = favorites.filter(fav => fav.id !== item.id)
	localStorage.setItem('favorites', JSON.stringify(updatedFavorites))

	// Emit a custom event
	window.dispatchEvent(new Event('favoritesUpdated'))
}