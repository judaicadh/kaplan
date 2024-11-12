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
  Stats, RangeInput
} from 'react-instantsearch'
 import { algoliasearch } from "algoliasearch";
import { createBrowserHistory } from "history";
import HitTest from "@components/Search/Hit";
import "../../styles/App/App.css";
import "instantsearch.css/themes/reset.css";
import "../../styles/App/Theme.css";
import "../../styles/App/App.mobile.css";
import "../../styles/App/Pagination.css";

import { Panel } from '@components/Search/Panel.tsx'

import CustomRangeSlider from '@components/Search/DateRange.tsx'
import DateRangeSliderFilter from '@components/Search/DateRange.tsx'
import DateRangeSlider from '@components/Search/DateRange.tsx'

const searchClient = algoliasearch("ZLPYTBTZ4R", "be46d26dfdb299f9bee9146b63c99c77");

// Custom router setup
const history = createBrowserHistory();
const dateToTimestamp = (dateString) => {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : Math.floor(date.getTime() / 1000);
};

const timestampToDate = (timestamp) => {
  if (timestamp === null || timestamp === undefined) return "";
  const date = new Date(timestamp * 1000);
  return date.toISOString().split('T')[0];
};

function createURL(routeState) {
  const { q } = routeState;
  const queryParameters = q ? { q } : {};
  const queryString = new URLSearchParams(queryParameters).toString();

  return `${window.location.pathname}?${queryString}`;
}

function getStateFromLocation(location) {
  const searchParams = new URLSearchParams(location.search);
  return {
    q: searchParams.get("q") || "",
  };
}
const MIN_TIMESTAMP = -17987443200; // January 1, 1400 in UNIX timestamp
const MAX_TIMESTAMP = -2208988800;  // January 1, 1900 in UNIX timestamp

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
    dispose() {},
  },
  stateMapping: {
    stateToRoute(uiState) {
      const indexUiState = uiState.Dev_Kaplan || {};
      return {
        q: indexUiState.query,
        start: indexUiState.range?.start || '',
        end: indexUiState.range?.end || '',
      };
    },
    routeToState(routeState) {
      return {
        Dev_Kaplan: {
          query: routeState.q,
          range: {
            start: routeState.start,
            end: routeState.end,
          },
        },
      };
    },
  },
};

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const searchParams = new URLSearchParams(window.location.search);
  const initialQuery = searchParams.get("q") || "";

  function openFilters() {
    document.body.classList.add("filtering");
    window.scrollTo(0, 0);
  }

  function closeFilters() {
    document.body.classList.remove("filtering");
    containerRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div id="container">
      <InstantSearch searchClient={searchClient} indexName="Dev_Kaplan" routing={routing} insights>
        <header className="header">
          <p className="header-title">Explore the Kaplan Collection</p>
          <SearchBox
            placeholder="Rebecca Gratz, Billhead, Trade Card..."
            defaultValue={initialQuery}
            loadingIconComponent={({ classNames }) => (
              <div className={classNames.loadingIcon}>Loading</div>
            )}
          />
        </header>



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
                    <RefinementList attribute="type" searchable={true} showMore={true} searchablePlaceholder="Search for Object Types…" />
                  </Panel>
                </DynamicWidgets>
                 <Panel header="Name">
                  <RefinementList attribute="name" searchable={true} showMore={true} searchablePlaceholder="Search for People and Businesses" />
                </Panel>
                <Panel header="Thumbnails">
                  <ToggleRefinement attribute="hasRealThumbnail" label="Only Items with Images" />
                </Panel>
                <Panel header="Date">
                  <DateRangeSlider
                    dateFields={[
                      "startDate1", "endDate1",
                      "startDate2", "endDate2",
                      "startDate3", "endDate3",
                      "startDate4", "endDate4",
                      "startDate5", "endDate5",
                      "startDate6", "endDate6",
                      "startDate7", "endDate7",
                      "startDate8", "endDate8",
                      "startDate9", "endDate9",
                      "startDate10", "endDate10",
                      "startDate11", "endDate11"
                    ]}
                    minTimestamp={-15135361438} // Example start date in your data range
                    maxTimestamp={-2208988800} // Example end date in your data range
                  />


                </Panel>
              </div>
            </section>
            <footer className="container-filters-footer" />
          </div>
          <section className="container-results">
            <header className="container-header container-options">
              <CurrentRefinements />
              <SortBy
                items={[
                  { value: 'Dev_Kaplan', label: 'Default' },
                  { label: "Sort by name", value: "title" },
                  { label: "Sort by type", value: "type" },
                ]}
              />
              <HitsPerPage
                items={[
                  { label: "20 hits per page", value: 20, default: true },
                  { label: "40 hits per page", value: 40 },
                  { label: "60 hits per page", value: 60 },
                  { label: "100 hits per page", value: 100 },
                ]}
              />
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
}

export default App;