import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits, Snippet, Highlight } from 'react-instantsearch-dom';

const searchClient = algoliasearch(
    'ZLPYTBTZ4R',  // Your App ID
    'be46d26dfdb299f9bee9146b63c99c77'  // Your API Key
);
const Hit = ({ hit, sendEvent }) => (

    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white mx-auto" onClick={() => sendEvent("click", hit, "Product Clicked")}>
        <a href={`/kaplan/item/${hit.slug}`} className="block hover:shadow-lg transition-shadow duration-300">
            {/* Wrapper to center the image */}
            <div className="flex justify-center">
                <img
                    src={hit.thumbnail || 'default-thumbnail.jpg'}
                    alt={hit['title from colenda'] || 'No title available'}
                    className="h-48 object-cover"
                />
            </div>
            <div className="px-6 py-4">
                {/* Highlighted Title */}
                <div className="font-bold text-xl mb-2">
                    <Highlight attribute="title from colenda" hit={hit} />
                </div>

                {/* Snippet of Description */}
                <p className="text-gray-700 text-base">
                    <Snippet hit={hit} attribute="description" />
                </p>
            </div>
            {/* Additional Info */}
            <div className="px-6 pt-4 pb-2">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          {hit.object_type}
        </span>
                {hit.geography && (
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            {hit.geography}
          </span>
                )}
            </div>
        </a>
    </div>
);
function App() {
    return (
        <InstantSearch indexName="Dev_Kaplan" searchClient={searchClient}>
            <h1>Kaplan Collection Search</h1>
            <SearchBox />

            <Hits hitComponent={Hit} />
        </InstantSearch>
    );
}

export default App;
