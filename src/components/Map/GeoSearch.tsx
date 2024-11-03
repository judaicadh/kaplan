import React, { useState, useEffect } from 'react';
import { useGeoSearch, type UseGeoSearchProps, useSearchBox } from 'react-instantsearch'
import { Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import * as L from 'leaflet';
import { Checkbox } from 'flowbite-react';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
import type { LeafletEvent } from 'leaflet'

export function KaplanGeoSearch() {
  const { query, refine: refineQuery } = useSearchBox();
  const {
    items,
    refine: refineItems,
    currentRefinement,
    clearMapRefinement,
  } = useGeoSearch();

  const [previousQuery, setPreviousQuery] = useState(query);
  const [skipViewEffect, setSkipViewEffect] = useState(false);
  const onViewChange = ({ target }) => {
    setSkipViewEffect(true);

    refineItems({
      northEast: target.getBounds().getNorthEast(),
      southWest: target.getBounds().getSouthWest(),
    });
  };

  const map = useMapEvents({
    zoomend: onViewChange,
    dragend: onViewChange,
  });

  if (query !== previousQuery) {
    if (currentRefinement) {
      clearMapRefinement();
    }

    // `skipViewEffect` allows us to bail out of centering on the first result
    // if the query has been cleared programmatically.
    if (items.length > 0 && !skipViewEffect) {
      map.setView(items[0]._geoloc);
    }

    setSkipViewEffect(false);
    setPreviousQuery(query);
  }

  return (
   <>


      <MarkerClusterGroup>
        {items.map((hit) => {
          if (hit._geoloc && typeof hit._geoloc.lat === 'number' && typeof hit._geoloc.lng === 'number') {
            return (
              <Marker key={hit.id} position={[hit._geoloc.lat, hit._geoloc.lng]}>
                <Popup>
                  <a href={`/item/${hit.slug}`}>
                    <strong>{hit.title}</strong>
                  </a>
                </Popup>
              </Marker>
            );
          } else if (
            Array.isArray(hit._geoloc) &&
            hit._geoloc.length > 0 &&
            typeof hit._geoloc[0].lat === 'number' &&
            typeof hit._geoloc[0].lng === 'number'
          ) {
            return (
              <Marker key={hit.id} position={[hit._geoloc[0].lat, hit._geoloc[0].lng]}>
                <Popup>
                  <a href={`/item/${hit.slug}`}>
                    <strong>{hit.title}</strong>
                  </a>
                </Popup>
              </Marker>
            );
          } else {
            console.warn(`Missing or invalid _geoloc for hit:`, hit);
            return null;
          }
        })}
      </MarkerClusterGroup>
    </>
  );
}

export default KaplanGeoSearch;