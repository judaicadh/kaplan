
import React, { useEffect } from 'react';
import algoliasearch from 'algoliasearch/lite';
import instantsearch from 'instantsearch.js';

const appId = import.meta.env.PUBLIC_ALGOLIA_APP_ID;
const apiKey = import.meta.env.PUBLIC_ALGOLIA_SEARCH_API_KEY;
const indexName = 'Kaplan';

function SearchComponent() {
    useEffect(() => {
        const searchClient = algoliasearch(appId, apiKey);

        const search = instantsearch({
            indexName,
            searchClient,
        });

        search.addWidgets([
            instantsearch.widgets.searchBox({
                container: '#search-box',
                placeholder: 'Search the collection...',
            }),
            // ...other widgets
        ]);

        search.start();
    }, []);

    return (
        <>
            <div id="search-box"></div>
            <div id="current-refinements"></div>
            <div id="refinement-list"></div>
            <div id="hits"></div>
            <div id="pagination"></div>
        </>
    );
}

export default SearchComponent;