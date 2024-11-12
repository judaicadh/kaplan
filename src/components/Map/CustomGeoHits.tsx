import { useGeoSearch, type UseGeoSearchProps } from 'react-instantsearch';
import type { LeafletEvent } from 'leaflet'

import {
	MapContainer,
	Marker,
	Popup,
	TileLayer,
	useMapEvents,
} from 'react-leaflet';
import type { GeoHit } from 'instantsearch.js'



export function CustomGeoSearch(props: UseGeoSearchProps) {
	const { items, refine } = useGeoSearch<GeoHit>(props);

	function onViewChange({ target }: LeafletEvent) {
		refine({
			northEast: target.getBounds().getNorthEast(),
			southWest: target.getBounds().getSouthWest(),
		});
	}

	useMapEvents({ zoomend: onViewChange, dragend: onViewChange });

	return (
		<MapContainer
			center={[48.85, 2.35]}
			zoom={10}
			minZoom={4}
			scrollWheelZoom={true}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{items.map((item) => (
				<Marker key={item.objectID} position={[item._geoloc.lat,item._geoloc.lng]}>
					<Popup>
						<strong>{item.title}</strong>

					</Popup>
				</Marker>
			))}
		</MapContainer>
	);
}
export default CustomGeoSearch;