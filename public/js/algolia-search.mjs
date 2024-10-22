import { liteClient as algoliasearch } from 'algoliasearch/lite';
import instantsearch from 'instantsearch.js';
import { carousel } from 'instantsearch.js/es/templates';
import {
    configure,
    hits,
    pagination,
    panel,
    refinementList,
    searchBox,
    trendingItems,
} from 'instantsearch.js/es/widgets';

import 'instantsearch.css/themes/satellite.css';

const searchClient = algoliasearch(
    'ZLPYTBTZ4R',
    'be46d26dfdb299f9bee9146b63c99c77'
);

const search = instantsearch({
    indexName: 'Dev_Kaplan',
    searchClient,
    insights: true,
});

search.addWidgets([
    searchBox({
        container: '#searchbox',
        placeholder: 'Search...',
        cssClasses: {
            root: 'relative',
            input: 'block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500',
        },
        templates: {
            submit: `
        <svg class="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.386a1 1 0 01-1.414 1.414l-4.387-4.386zM8 14a6 6 0 100-12 6 6 0 000 12z"
          />
        </svg>
      `,
        },
    }),
    hits({
        container: '#hits',
        templates: {
            item: (hit, { html, components }) => html`
                <article class="p-4 bg-white rounded-lg shadow">
                    <h2 class="text-lg font-semibold text-gray-900">
                        <a href="/kaplan/item/${hit.slug}">
                            ${components.Highlight({ hit, attribute: 'title from colenda' })}
                        </a>
                    </h2>
                    <p class="mt-2 text-gray-700">
                        ${components.Highlight({ hit, attribute: 'type' })}
                    </p>
                    <a
                            href="/kaplan/item/${hit.slug}"
                            class="mt-4 inline-block text-indigo-600 hover:text-indigo-800"
                    >
                        See product →
                    </a>
                </article>
            `,
        },
    }),
    configure({
        hitsPerPage: 8,
    }),
    panel({
        templates: {
            header: '<h2 class="text-xl font-semibold mb-4">Type</h2>',
        },
        cssClasses: {
            root: 'mb-6',
            body: 'space-y-2',
        },
    })(refinementList)({
        container: '#brand-list',
        attribute: 'type',
        cssClasses: {
            list: 'space-y-2',
            label: 'flex items-center',
            checkbox: 'mr-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500',
            labelText: 'text-gray-700',
            count: 'ml-auto text-gray-500',
        },
    }),
    pagination({
        container: '#pagination',
        cssClasses: {
            root: 'inline-flex items-center space-x-2 mt-6',
            item: 'px-3 py-1 border border-gray-300 rounded',
            link: 'text-gray-700 hover:bg-gray-100',
            selectedItem: 'bg-indigo-600 text-white',
            disabledItem: 'text-gray-400 cursor-not-allowed',
        },
        templates: {
            previous: 'Previous',
            next: 'Next',
        },
    }),
]);

search.start();