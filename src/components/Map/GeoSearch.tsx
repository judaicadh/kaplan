import React, { useState } from 'react';
import { useConnector, type AdditionalWidgetProperties } from 'react-instantsearch';
import connectGeoSearch, {
	type GeoSearchConnectorParams,
	type GeoSearchWidgetDescription
} from 'instantsearch.js/es/connectors/geo-search/connectGeoSearch';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Define UseGeoSearchProps, extending GeoSearchConnectorParams
export interface UseGeoSearchProps extends GeoSearchConnectorParams {
	initialPosition?: [number, number];
	aroundRadius?: number;
	enableRefine?: boolean;
	enableRefineControl?: boolean;
}

export function useGeoSearch(
	props: UseGeoSearchProps,
	additionalWidgetProperties?: AdditionalWidgetProperties
) {
	return useConnector<GeoSearchConnectorParams, GeoSearchWidgetDescription>(
		connectGeoSearch,
		props,
		additionalWidgetProperties
	);
}

// GeoSearch component with refinement control
export const GeoSearch: React.FC<UseGeoSearchProps> = ({
																												 initialPosition = [40.7128, -74.0060],
																												 aroundRadius,
																												 enableRefine = true,
																												 enableRefineControl = true,
																												 ...props
																											 }) => {
	const { items, refine } = useGeoSearch(props, {
		$$widgetType: 'my-organization.geoSearch',
	});

	const [isRefineEnabled, setIsRefineEnabled] = useState(enableRefine);

	useMapEvents({
		moveend: (event) => {
			if (isRefineEnabled) {
				const bounds = event.target.getBounds();
				refine({
					northEast: bounds.getNorthEast(),
					southWest: bounds.getSouthWest(),
				});
			}
		},
	});

	return (
		<MapContainer center={initialPosition} zoom={12} style={{ height: '500px', width: '100%' }}>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{enableRefineControl && (
				<label>
					<input
						type="checkbox"
						checked={isRefineEnabled}
						onChange={() => setIsRefineEnabled(!isRefineEnabled)}
					/>
					Enable Refinement on Map Move
				</label>
			)}
			{items && items.length > 0 ? (
				items.map((item, index) => (
					<div key={index}>
						<h3>
							Location: {item._geoloc?.lat}, {item._geoloc?.lng}
						</h3>
					</div>
				))
			) : (
				<p>No results found.</p>
			)}
		</MapContainer>
	);
};

export default GeoSearch;