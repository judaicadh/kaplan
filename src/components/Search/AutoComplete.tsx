import React, { useState } from 'react';
import { InstantSearch, connectAutoComplete } from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_ALGOLIA_API_KEY
);

const Autocomplete = connectAutoComplete(({ hits, currentRefinement, refine }: any) => (
  <div>
    <input
      type="text"
      value={currentRefinement}
      onChange={(e) => refine(e.target.value)}
      placeholder="Search for items..."
    />
    <ul>
      {hits.map((hit: any) => (
        <li key={hit.id}>
          <strong>{hit.title}</strong>
        </li>
      ))}
    </ul>
  </div>
));

export default function AutoCompleteSearch() {
  return (
    <InstantSearch indexName={import.meta.env.VITE_ALGOLIA_INDEX_NAME} searchClient={searchClient}>
      <Autocomplete />
    </InstantSearch>
  );
}