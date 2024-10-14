import algoliasearch from 'algoliasearch/lite';
import instantsearch from 'instantsearch.js';

const appId = import.meta.env.PUBLIC_ALGOLIA_APP_ID;
const apiKey = import.meta.env.PUBLIC_ALGOLIA_SEARCH_API_KEY;
const indexName = 'Kaplan'; // Replace with your index name

const searchClient = algoliasearch(appId, apiKey);

const search = instantsearch({
    indexName: indexName,
    searchClient,
});

search.addWidgets([
    instantsearch.widgets.searchBox({
        container: '#search-box',
        placeholder: 'Search the archives...',
    }),
    // ...other widgets
]);

search.start();