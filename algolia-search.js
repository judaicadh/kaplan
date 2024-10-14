// algolia-search.js

import { algoliasearch } from "algoliasearch"; // Corrected default import
import instantsearch from 'instantsearch.js';
import { searchBox, hits } from 'instantsearch.js/es/widgets';
import * as dotenv from "dotenv"
dotenv.config()
// Define and export the algoliaSearch function
export default function algoliaSearch() {
    const searchClient = algoliasearch(
        import.meta.env.PUBLIC_ALGOLIA_APP_ID,
        import.meta.env.PUBLIC_ALGOLIA_SEARCH_API_KEY
    );

    const search = instantsearch({
        indexName: 'Kaplan',  // Replace with your actual index name
        searchClient,
    });

    search.addWidgets([
        searchBox({
            container: '#searchbox',
            placeholder: 'Search for articles',
        }),
        hits({
            container: '#hits',
            templates: {
                item: `
                    <div>
                        <strong>{{#helpers.highlight}}{ "attribute": "title" }{{/helpers.highlight}}</strong>
                        <p>{{#helpers.highlight}}{ "attribute": "description" }{{/helpers.highlight}}</p>
                    </div>
                `,
            },
        }),
    ]);

    search.start();
}