import { Configure, InstantSearch, useConfigure, useGeoSearch } from 'react-instantsearch'
import React, { useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { algoliasearch } from 'algoliasearch'

const searchClient = algoliasearch('ZLPYTBTZ4R', 'be46d26dfdb299f9bee9146b63c99c77')

const customIcon = new L.DivIcon({
	html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="40" height="47">
      <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/>
    </svg>`,
	className: 'custom-icon', // Optional, for custom styling
	iconSize: [40, 47], // Set the size of your icon
	iconAnchor: [20, 47], // Align the bottom of the icon
	popupAnchor: [0, -47] // Position the popup above the icon
})

function CustomGeoSearch() {
	const { items, refine } = useGeoSearch()
	const [searchOnMove, setSearchOnMove] = useState(false) // Default to false

	const onViewChange = ({ target }: any) => {
		if (!searchOnMove) return // Skip if toggle is off

		const bounds = target.getBounds()
		refine({
			northEast: { lat: bounds.getNorthEast().lat, lng: bounds.getNorthEast().lng },
			southWest: { lat: bounds.getSouthWest().lat, lng: bounds.getSouthWest().lng }
		});
	};

	const MapEventsHandler = () => {
		useMapEvents({
			zoomend: onViewChange,
			dragend: onViewChange
		});
		return null
	};

	const createClusterCustomIcon = (cluster) => {
		const count = cluster.getChildCount()
		return L.divIcon({
			html: `<span>${count}</span>`,
			className: 'custom-marker-cluster',
			iconSize: L.point(40, 40, true)
		})
	}
	const handleToggle = () => {
		if (searchOnMove) {
			// Reset to default bounds that include all locations
			refine({
				northEast: { lat: 90, lng: 180 },
				southWest: { lat: -90, lng: -180 }
			});
		}
		setSearchOnMove((prevState) => !prevState) // Safely toggle the state
	};

	return (
		<div className="relative">
			<InstantSearch searchClient={searchClient} indexName="Dev_Kaplan" routing={true} insights={true}>
				<Configure hitsPerPage={1000} />

			{/* Toggle for "Search when I move the map" */}
			<div className="pb-3 flex items-center space-x-3">
				<label className="relative inline-flex items-center cursor-pointer space-x-2">
					<input
						type="checkbox"
						checked={searchOnMove}
						onChange={handleToggle}
						className="sr-only"
					/>
					<div
						className={`w-11 h-6 rounded-full border-sky-600 border-2 transition-colors duration-300 ${
							searchOnMove ? 'bg-sky-600' : 'bg-gray-300'
						}`}
					>
						<div
							className={`w-5 h-5 absolute top-0.5 bg-white rounded-full transition-transform duration-300 transform ${
								searchOnMove ? 'translate-x-5' : ''
							}`}
						></div>
					</div>
				</label>
				<div className="flex flex-col text-gray-900 dark:text-gray-300">
					<span className="text-sm font-medium">Refine search on map move</span>
				</div>
			</div>

			{/* Map */}
			<MapContainer
				style={{ height: '500px' }}
				center={[44.32694774299841, -100.5312500000005]}
				zoom={3}
				maxZoom={11}
				scrollWheelZoom={true}
				attributionControl={false}

			>

				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<MapEventsHandler />

				<MarkerClusterGroup
					chunkedLoading
					iconCreateFunction={(cluster) => createClusterCustomIcon(cluster)}
				>
					{items.map((hit, index) => {
						if (!hit._geoloc) return null

						const locations = Array.isArray(hit._geoloc) ? hit._geoloc : [hit._geoloc]
						return locations.map((loc, idx) => (
							<Marker
								key={`${hit.objectID}-${index}-${idx}`}
								position={[loc.lat, loc.lng]}
								title={loc.name || 'No Name'}
								icon={customIcon}
							>
								<Popup>
									{hit.slug ? (
										<a href={`item/${hit.slug}`} target="_blank" rel="noopener noreferrer">
											Visit Link
										</a>
									) : (
										<span>No URL available</span>
									)}
								</Popup>
							</Marker>
						))
					})}
				</MarkerClusterGroup>
			</MapContainer>
			</InstantSearch>
		</div>

	);
}

export default CustomGeoSearch