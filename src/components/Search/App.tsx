import { algoliasearch } from "algoliasearch";
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

} from 'react-instantsearch'

import { createBrowserHistory } from "history";
import HitTest from "@components/Search/Hit";
import "../../styles/App/App.css";
import "instantsearch.css/themes/reset.css";
import "../../styles/App/Theme.css";
import "../../styles/App/App.mobile.css";
import "../../styles/App/Pagination.css";

import { Panel } from '@components/Search/Panel.tsx'
import DateRangeSlider from '@components/Search/DateRange.tsx'
import { ClearFiltersMobile } from '@components/Search/ClearFiltersMobile.tsx'
import { SaveFiltersMobile } from '@components/Search/SaveFiltersMobile.tsx'
const searchClient = algoliasearch("ZLPYTBTZ4R", "be46d26dfdb299f9bee9146b63c99c77");



import { ResultsNumberMobile } from '@components/Search/ResultsNumberMobile.tsx'
import { ClearFilters } from '@components/Search/ClearFilters.tsx'
import { NoResultsBoundary } from '@components/Search/NoResultsBoundary.tsx'
import { NoResults } from '@components/Search/NoResults.tsx'
import { ScrollTo } from '@components/Search/ScrollTo.tsx'
// Custom router setup
const history = createBrowserHistory();


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
  const headerRef = useRef(null);
  const searchParams = new URLSearchParams(window.location.search);
  const initialQuery = searchParams.get("q") || "";

  function openFilters() {
    document.body.classList.add('filtering');
    window.scrollTo(0, 0);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('click', onClick);
  }


  function closeFilters() {
    document.body.classList.remove("filtering");
    containerRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  function onKeyUp(event: { key: string }) {
    if (event.key !== 'Escape') {
      return;
    }

    closeFilters();
  }

  function onClick(event: MouseEvent) {
    if (event.target !== headerRef.current) {
      return;
    }

    closeFilters();
  }

  return (
    <div id="container">
      <InstantSearch searchClient={searchClient} indexName="Dev_Kaplan" routing={routing} insights>
        <header className="header" ref={headerRef}>
          <p className="header-title">Explore the Kaplan Collection</p>
          <SearchBox
            placeholder="Rebecca Gratz, Billhead, Trade Card..."
            defaultValue={initialQuery}
            loadingIconComponent={({ classNames }) => (
              <div className={classNames.loadingIcon}>Loading</div>
            )}
            submitIconComponent={SubmitIcon}
          />
        </header>

        <Configure
          attributesToSnippet={['description:10']}
          snippetEllipsisText="…"
          removeWordsIfNoResults="allOptional"
        />
        <ScrollTo>
        <main className="container" ref={containerRef}>
          <div className="container-wrapper">
            <section className="container-filters">
              <Stats />
              <div className="container-header">
                <h2>Filters</h2>
                <div className="clear-filters" data-layout="desktop">
                  <ClearFilters />
                </div>

                <div className="clear-filters" data-layout="mobile">
                  <ResultsNumberMobile />
                </div>
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
                <Panel header="Date">
                  <DateRangeSlider
                    dateFields={[
                      'startDate1', 'endDate1',
                      'startDate2', 'endDate2',
                      'startDate3', 'endDate3',
                      'startDate4', 'endDate4',
                      'startDate5', 'endDate5',
                      'startDate6', 'endDate6',
                      'startDate7', 'endDate7',
                      'startDate8', 'endDate8',
                      'startDate9', 'endDate9',
                      'startDate10', 'endDate10',
                      'startDate11', 'endDate11'
                    ]}
                    minTimestamp={-15135361438} // Example start date in your data range
                    maxTimestamp={-2208988800} // Example end date in your data range
                  />


                </Panel>
              </div>
            </section>
            <footer className="container-filters-footer" data-layout="mobile">
              <div className="container-filters-footer-button-wrapper">
                <ClearFiltersMobile containerRef={containerRef} />
              </div>

              <div className="container-filters-footer-button-wrapper">
                <SaveFiltersMobile onClick={closeFilters} />
              </div>
            </footer>
          </div>
          <section className="container-results">
            <header className="container-header container-options">
              <SortBy

                items={[
                  { value: 'Dev_Kaplan', label: 'Sort by relevance', },
                  { value: 'title',  label: 'Sort by name', },
                  { value: "type", label: 'Sort by type',  },
                ]}
              />
              <CurrentRefinements />
              <ClearRefinements />

              <HitsPerPage
                items={[
                  { label: "20 hits per page", value: 20, default: true },
                  { label: "40 hits per page", value: 40 },
                  { label: "60 hits per page", value: 60 },
                  { label: "100 hits per page", value: 100 },
                ]}
              />
            </header>
            <NoResultsBoundary fallback={<NoResults />}>
              <Hits hitComponent={HitTest} />
            </NoResultsBoundary>
            <footer className="container-footer">
              <Configure hitsPerPage={20} />
              <Pagination />
              <footer className="container-filters-footer" data-layout="mobile">
                <div className="container-filters-footer-button-wrapper">
                  <ClearFiltersMobile containerRef={containerRef} />
                </div>

                <div className="container-filters-footer-button-wrapper">
                  <SaveFiltersMobile onClick={closeFilters} />
                </div>
              </footer>
            </footer>
          </section>
        </main>
        </ScrollTo>

        <aside data-layout="mobile">
          <button
            className="filters-button"
            data-action="open-overlay"
            onClick={openFilters}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 14">
              <path
                d="M15 1H1l5.6 6.3v4.37L9.4 13V7.3z"
                stroke="#fff"
                strokeWidth="1.29"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Filters
          </button>
        </aside>
      </InstantSearch>
    </div>
      );
      }

      function SubmitIcon() {
      return (
      <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 18 18"
      aria-hidden="true"
      >
      <g
      fill="none"
      fillRule="evenodd"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.67"
      transform="translate(1 1)"
      >
      <circle cx="7.11" cy="7.11" r="7.11" />
      <path d="M16 16l-3.87-3.87" />
      </g>
      </svg>
      );
    }

export default App;