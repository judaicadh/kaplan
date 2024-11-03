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
const searchClient = algoliasearch('ZLPYTBTZ4R', 'be46d26dfdb299f9bee9146b63c99c77');

// Custom router setup
const history = createBrowserHistory();

function createURL(routeState) {
  const { q } = routeState;
  const queryParameters = {};
  if (q) {
    queryParameters.q = q;
  }


  const queryString = new URLSearchParams(queryParameters).toString();

  return `${window.location.pathname}?${queryString}`;
}

function getStateFromLocation(location) {
  const searchParams = new URLSearchParams(location.search);
  return {
    q: searchParams.get('q') || '',

  };
}

const routing = {
  router: {
    onUpdate(callback) {
      return history.listen(({ location }) => {
        callback(getStateFromLocation(location));
      });
    },
    read() {
      return getStateFromLocation(history.location);
    },
    write(routeState) {
      const url = createURL(routeState);
      if (history.location.pathname + history.location.search !== url) {
        history.push(url);
      }
    },
    createURL,
    dispose() {
      // Clean up listeners
    },
  },
  stateMapping: {
    stateToRoute(uiState) {
      const indexUiState = uiState.Dev_Kaplan || {};
      return {
        q: indexUiState.query,

        // Map other UI state parameters as needed
      };
    },
    routeToState(routeState) {
      return {
        Dev_Kaplan: {
          query: routeState.q,

          // Map other route state parameters as needed
        },
      };
    },
  },
};

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const searchParams = new URLSearchParams(window.location.search);
  const initialQuery = searchParams.get('q') || '';

  function openFilters() {
    document.body.classList.add('filtering');
    window.scrollTo(0, 0);
  }


  function closeFilters() {
    // Remove the filtering class from the body
    document.body.classList.remove('filtering');

    // Scroll containerRef into view if it is defined
    containerRef.current?.scrollIntoView({ behavior: 'smooth' });
  }


  return (
    <div id="container">

      <InstantSearch
        searchClient={searchClient}
        indexName="Dev_Kaplan"

        routing={routing}
        insights
      >
        <header className="header">
          <p className="header-title">Explore the Kaplan Collection</p>
          <SearchBox placeholder="Rebecca Gratz, Billhead, Trade Card..." defaultValue={initialQuery}
                     loadingIconComponent={({ classNames }) => (
                       <div className={classNames.loadingIcon}>Loading</div>
                     )} />
        </header>

        <Configure attributesToSnippet={['description:10']} snippetEllipsisText="…"
                   removeWordsIfNoResults="allOptional" />

          <main className="container" ref={containerRef}>
            <div className="container-wrapper">
              <section className="container-filters">
                <Stats />
                <div className="container-header">

                  <h2>Filters</h2>
                  <ClearRefinements translations={{ resetButtonText: 'Clear all' }} />

                </div>
                <div className="container-body">

                  <DynamicWidgets>

                    <Panel header="Types">

                      <RefinementList attribute="type" searchable={true} showMore={true}
                                      searchablePlaceholder="Search for Object Types…" />
                    </Panel>


                  </DynamicWidgets>

                  <Panel header="Name">
                    <RefinementList attribute="name" searchable={true} showMore={true}
                                    searchablePlaceholder="Search for People and Businesses" />
                  </Panel>
                  <Panel header="Thumbnails">
                    <ToggleRefinement attribute="hasRealThumbnail" label="Only Items with Images" />
                  </Panel>


                </div>
              </section>
              <footer className="container-filters-footer">

              </footer>
            </div>
            <section className="container-results">
              <header className="container-header container-options">
                <CurrentRefinements />

                <SortBy items={[{ label: 'Sort by name', value: 'title' }, { label: 'Sort by type', value: 'type.' }]} />
                <HitsPerPage items={[
                  { label: '20 hits per page', value: 20, default: true },
                  { label: '40 hits per page', value: 40 },
                  { label: '60 hits per page', value: 60 },
                  { label: '100 hits per page', value: 100 }
                ]} />
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
  )
    ;
}


export default App;