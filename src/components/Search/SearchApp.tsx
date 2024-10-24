import React from 'react';
import { InstantSearch, Hits, SearchBox } from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_ALGOLIA_API_KEY
);

type HitProps = {
    hit: {
        title: string;
        slug: string;
        description: string;
        thumbnail?: string;
    };
};

function Hit({ hit }: HitProps) {
    return (
      <div>
          {hit.thumbnail && <img src={hit.thumbnail} alt={hit.title} />}
          <h2>{hit.title}</h2>
          <p>{hit.description}</p>
          <a href={hit.slug}>Read More</a> {/* Link to Astro page using slug */}
      </div>
    );
}

export default function AlgoliaSearch() {
    return (
      <InstantSearch indexName={import.meta.env.VITE_ALGOLIA_INDEX_NAME} searchClient={searchClient}>
          <SearchBox />
          <Hits hitComponent={Hit} />
      </InstantSearch>
    );
}