import React, { useState } from 'react'
import { useGeoSearch } from 'react-instantsearch'
import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	useMapEvents
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function CustomGeoSearch() {
	const { items, refine } = useGeoSearch()
	const [searchOnMove, setSearchOnMove] = useState(false) // Default to false

	const onViewChange = ({ target }: any) => {
		if (!searchOnMove) return // Skip if toggle is off

		const bounds = target.getBounds()
		refine({
			northEast: { lat: bounds.getNorthEast().lat, lng: bounds.getNorthEast().lng },
			southWest: { lat: bounds.getSouthWest().lat, lng: bounds.getSouthWest().lng }
		})
	}

	const MapEventsHandler = () => {
		useMapEvents({
			zoomend: onViewChange,
			dragend: onViewChange
		})
		return null
	}

	const handleToggle = () => {
		if (searchOnMove) {
			// Reset to default bounds that include all locations
			refine({
				northEast: { lat: 90, lng: 180 },
				southWest: { lat: -90, lng: -180 }
			})
		}
		setSearchOnMove((prevState) => !prevState) // Safely toggle the state
	}

	return (
		<div className="relative">
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
				center={[44.32694774299841, -100.5312500000005]}
				zoom={3}
				maxZoom={10}
				scrollWheelZoom={true}
				className="h-96 w-full rounded-lg shadow-md"
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<MapEventsHandler />
				{items
					.filter(
						(item) =>
							item._geoloc &&
							typeof item._geoloc.lat === 'number' &&
							typeof item._geoloc.lng === 'number'
					)
					.map((item) => (
						<Marker
							key={item.objectID}
							position={[item._geoloc.lat, item._geoloc.lng]}
						>
							<Popup>
								<strong>{item.title}</strong>
								<br />
								{item.description || 'No additional information'}
							</Popup>
						</Marker>
					))}
			</MapContainer>
		</div>
	)
}

export default CustomGeoSearch