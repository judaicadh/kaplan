import React, { useState, useRef, useEffect } from "react";
import {
  Configure,
  ClearRefinements,
  Hits,
  InstantSearch,
  Pagination,
  RefinementList,
  SearchBox,
  DynamicWidgets,
  SortBy,
  ToggleRefinement,
  HitsPerPage,
  CurrentRefinements,
  Stats,
} from "react-instantsearch";
import { algoliasearch } from "algoliasearch";
import { createBrowserHistory } from "history";
import type { Location as HistoryLocation } from "history";
import { Panel } from "../Search/Panel"; // Ensure this path is correct
import HitTest from "@components/Search/Hit";

import "leaflet/dist/leaflet.css";
import "../../styles/App/App.css";
import "instantsearch.css/themes/reset.css";
import "../../styles/App/Theme.css";
import "../../styles/App/App.css";
import "../../styles/App/App.mobile.css";
import "../../styles/App/Pagination.css";

import { MapContainer, TileLayer } from "react-leaflet";
import "react-leaflet-markercluster/dist/styles.min.css";
import KaplanGeoSearch from '@components/Map/GeoSearch.tsx';
import { Checkbox } from 'flowbite-react'; // Adjust the import path if necessary

const searchClient = algoliasearch("ZLPYTBTZ4R", "be46d26dfdb299f9bee9146b63c99c77");

const history = createBrowserHistory();

function createURL(routeState: any) {
  const { q } = routeState;
  const queryParameters: { [key: string]: string } = {};
  if (q) {
    queryParameters.q = q;
  }
  return `${window.location.pathname}${queryParameters.q ? `?${queryParameters.q}` : ""}`;
}

function getStateFromLocation(location: HistoryLocation) {
  const searchParams = new URLSearchParams(location.search);
  return {
    q: searchParams.get("q") || "",
  };
}

const routing = {
  router: {
    onUpdate(callback: (state: any) => void) {
      return history.listen(({ location }) => {
        callback(getStateFromLocation(location));
      });
    },
    read() {
      return getStateFromLocation(history.location);
    },
    write(routeState: any) {
      const url = createURL(routeState);
      if (history.location.pathname + history.location.search !== url) {
        history.push(url);
      }
    },
    createURL,
    dispose() {},
  },
  stateMapping: {
    stateToRoute(uiState: any) {
      const indexUiState = uiState.Dev_Kaplan || {};
      return {
        q: indexUiState.query,
      };
    },
    routeToState(routeState: any) {
      return {
        Dev_Kaplan: {
          query: routeState.q,
        },
      };
    },
  },
};

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const searchParams = new URLSearchParams(window.location.search);
  const initialQuery = searchParams.get("q") || "";

  const [isDetached, setIsDetached] = useState(false);

  // Track screen size and toggle detached mode based on width
  useEffect(() => {
    const handleResize = () => setIsDetached(window.innerWidth <= 600);
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div id="container">
      <header></header>
      <InstantSearch searchClient={searchClient} indexName="Dev_Kaplan" routing={routing} insights>
        <header className="header">
          <p className="header-title">Explore the Kaplan Collection</p>
          <SearchBox placeholder="Rebecca Gratz, Billhead, Trade Card..." defaultValue={initialQuery} />
        </header>

        <Configure removeWordsIfNoResults="allOptional" />

        <main className="container" ref={containerRef}>
          <div className="container-wrapper">
            <section className="container-filters">
              <Stats />
              <div className="container-header">
                <h2>Filters</h2>
                <ClearRefinements translations={{ resetButtonText: "Clear all" }} />
              </div>
              <div className="container-body">
                <DynamicWidgets>
                  <Panel header="Types">
                    <RefinementList attribute="type" searchable showMore searchablePlaceholder="Search for Object Types…" />
                  </Panel>
                </DynamicWidgets>
                <Panel header="Name">
                  <RefinementList attribute="name" searchable showMore searchablePlaceholder="Search for People and Businesses" />
                </Panel>
                <Panel header="Thumbnails">
                  <ToggleRefinement attribute="hasRealThumbnail" label="Only Items with Images" />
                </Panel>

                <Panel header="Map">
                  <MapContainer
                    className={`markercluster-map ${isDetached ? 'detached' : ''}`}
                    style={{ height: isDetached ? '100vh' : '500px' }}
                    doubleClickZoom
                    center={[38.85, -60.35]}
                    zoom={1}
                    zoomControl
                    scrollWheelZoom
                    closePopupOnClick
                  >
                    <TileLayer
                      attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />
                    <KaplanGeoSearch />
                  </MapContainer>
                  {isDetached && (
                    <button className="map-close-button" onClick={() => setIsDetached(false)}>
                      Close Map
                    </button>
                  )}
                </Panel>
              </div>
            </section>
          </div>

          <section className="container-results">
            <header className="container-header container-options">
              <CurrentRefinements />
              <SortBy items={[{ label: 'Sort by name', value: 'Dev_Kaplan' }, { label: 'Sort by type', value: 'Dev_Kaplan_type' }]} />
              <HitsPerPage items={[{ label: '20 hits per page', value: 20, default: true }, { label: '40 hits per page', value: 40 }, { label: '60 hits per page', value: 60 }, { label: '100 hits per page', value: 100 }]} />
            </header>
            <Hits hitComponent={HitTest} />
            <footer className="container-footer">
              <Configure hitsPerPage={20} />
              <Pagination />
            </footer>
          </section>
        </main>
      </InstantSearch>
    </div>
  );
};

export default App;