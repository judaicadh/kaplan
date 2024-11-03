// HitsMarkers.tsx
import React from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import { useHits } from "react-instantsearch";

const HitsMarkers: React.FC = () => {
  const { hits } = useHits();

  return (
    <>
      {hits.map((hit) => {
        if (hit._geoloc) {
          return (
            <Marker
              key={hit.objectID}
              position={[hit._geoloc.lat, hit._geoloc.lng]}
            >
              <Popup>
                <strong>{hit.title}</strong>
                <br />
              </Popup>
            </Marker>
          );
        }
        return null;
      })}
    </>
  );
};

export default HitsMarkers;
