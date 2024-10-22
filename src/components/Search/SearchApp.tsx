/** @jsx h */
/** @jsxRuntime classic */

import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits, Snippet, Highlight } from 'react-instantsearch-dom';

import { h } from 'preact';
import { AutocompleteComponents, AutocompleteSource } from '@algolia/autocomplete-core';
import '@algolia/autocomplete-theme-classic';

const appId = 'ZLPYTBTZ4R';
const apiKey = 'be46d26dfdb299f9bee9146b63c99c77';
const searchClient = algoliasearch(appId, apiKey);

type AutocompleteItem = {
    id: string;
    link: string;
    slug: string;
    date: string;
    peopleURI: string;
    title: string;
    type: string;
    subtype: string[];
    PhysicalLocation: string;
    description: string;
    thumbnail: string;
    manifestUrl: string;
    franklinLink: string;
    cross: string;
    column_type: string;
    dateC: string;
    geography: string;
    object_type: string;
    people: string;
};

autocomplete<AutocompleteItem>({
    container: '#autocomplete',
    placeholder: 'Search the Collection',
    getSources({ query }) {
        return [
            {
                sourceId: 'products',
                getItems() {
                    return getAlgoliaResults<AutocompleteItem>({
                        searchClient,
                        queries: [
                            {
                                indexName: 'instant_search',
                                query,
                            },
                        ],
                    });
                },
                templates: {
                    item({ item, components }: { item: AutocompleteItem; components: AutocompleteComponents }) {
                        return (
                            <div className="aa-ItemWrapper">
                                <div className="aa-ItemContent">
                                    <div className="aa-ItemIcon aa-ItemIcon--picture aa-ItemIcon--alignTop">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            width="40"
                                            height="40"
                                        />
                                    </div>

                                    <div className="aa-ItemContentBody">
                                        <div className="aa-ItemContentTitle">
                                            <components.Highlight hit={item} attribute="name" />
                                        </div>
                                        <div className="aa-ItemContentDescription">
                                            By <strong>{item.brand}</strong> in{' '}
                                            <strong>{item.categories[0]}</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    },
                    noResults() {
                        return 'No products matching your query.';
                    },
                },
            },
        ];
    },
});