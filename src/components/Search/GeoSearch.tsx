// src/components/GeoSearch.tsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useGeoSearch } from '../../hooks/useGeoSearch';
import { GeoSearchHit } from '../../types/types.ts';
import HitComponent from './HitComponent';

interface GeoSearchProps extends GeoSearchConnectorParams {}

export function GeoSearch(props: GeoSearchProps) {
    const { items, refine } = useGeoSearch(props, {
        $$widgetType: 'my-organization.geoSearch',
    });

    const MapEvents = () => {
        useMapEvents({
            moveend: () => {
                const map = useMapEvents.getMap();
                const center = map.getCenter();
                refine({
                    aroundLatLng: `${center.lat},${center.lng}`,
                });
            },
        });
        return null;
    };

    // Define the initial center and zoom level based on your requirements
    const center = [51.505, -0.09]; // Example coordinates (London)
    const zoom = 13;

    return (
        <MapContainer center={center} zoom={zoom} style={{ height: '500px', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapEvents />
            {items.map((item: GeoSearchHit) => (
                <Marker key={item.objectID} position={[item.lat, item.lng]}>
                    <Popup>
                        <strong>{item['title from colenda']}</strong>
                        <br />
                        {item.description}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

export default GeoSearch;