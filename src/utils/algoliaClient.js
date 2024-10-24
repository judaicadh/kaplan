import algoliasearch from 'algoliasearch/lite'
import instantsearch from 'instantsearch.js';
import { searchBox, hits } from 'instantsearch.js/es/widgets';


const searchClient = algoliasearch('ZLPYTBTZ4R', 'be46d26dfdb299f9bee9146b63c99c77');

const search = instantsearch({
    indexName: 'Dev_Kaplan',
    searchClient,
});

search.addWidgets([
    searchBox({
        container: '#searchbox',
    }),
    hits({
        container: '#hits',
        templates: {
            item: `
        <div>
        <a href={\`/kaplan/item/${hit.slug}\`} className="block transition-shadow duration-300 hover:shadow-lg">
          <img src="{{thumbnail}}" alt="{{title}}" />
          <h2>{{title}}</h2>
        </div>
        </a>
      `,
        },
    }),
]);

search.start();