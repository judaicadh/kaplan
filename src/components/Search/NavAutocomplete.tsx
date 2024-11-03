import { liteClient as algoliasearch } from "algoliasearch/lite";
import React, { useEffect, useRef, createElement, Fragment } from "react";
import { createRoot } from "react-dom/client";
import { autocomplete, getAlgoliaResults } from "@algolia/autocomplete-js";
import { createRedirectUrlPlugin } from "@algolia/autocomplete-plugin-redirect-url";

import type { AutocompleteComponents } from "@algolia/autocomplete-js";
import type { Hit } from "@algolia/client-search";
import type { Root } from "react-dom/client";
import "@algolia/autocomplete-theme-classic/dist/theme.css";
import { useSearchBox } from "react-instantsearch";

const searchClient = algoliasearch(
  "ZLPYTBTZ4R",
  "be46d26dfdb299f9bee9146b63c99c77",
);

type ProductHit = Hit<{
  name: string;
  type: string[];
  date: number;
  description: string;
  title: string;
  geography: string[];
  thumbnail: string;
  slug: string;
  url?: string;
  hasRealThumbnail: boolean;
  subject: string[];
}>;

function NavAutocomplete() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const panelRootRef = useRef<Root | null>(null);
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const search = autocomplete({
      container: containerRef.current,
      placeholder: "Search",
      detachedMediaQuery: "",
      insights: true,
      getSources({ query }) {
        return [
          {
            sourceId: "items",
            getItems() {
              return getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    indexName: "Dev_Kaplan",
                    query: query,
                  },
                ],
              });
            },
            templates: {
              item({ item, components }) {
                return <ProductItem hit={item} components={components} />;
              },
              noResults() {
                return "No items matching.";
              },
              footer() {
                return (
                  <div className="aa-ItemWrapper aa-Footer">
                    <a
                      href={`/search/?q=${encodeURIComponent(query)}`}
                      className="aa-ShowMore"
                    >
                      Show More
                    </a>
                  </div>
                );
              },
            },
            onSelect({ item, state, event }) {
              // Redirect to item detail page or search page with query
              window.location.href = `/search/?q=${encodeURIComponent(query)}`;
            },
          },
        ];
      },
      onSubmit({ state }) {
        const query = state.query;
        if (query.trim()) {
          window.location.href = `/search/?q=${encodeURIComponent(query)}`;
        }
      },
      renderer: { createElement, Fragment, render: () => {} },
      render({ children }, root) {
        if (!panelRootRef.current || rootRef.current !== root) {
          rootRef.current = root;

          panelRootRef.current?.unmount();
          panelRootRef.current = createRoot(root);
        }

        panelRootRef.current.render(children);
      },
    });

    return () => {
      search.destroy();
    };
  }, []);

  return <div ref={containerRef} />;
}

function ProductItem({ hit, components }) {
  return (
    <article className="aa-ItemWrapper">
      <div className="aa-ItemContent">
        <div className={"aa-ItemIcon"}>
          <a href={`/item/${hit.slug}`}>
            <img src={hit.thumbnail} alt={hit.title} />
          </a>
        </div>
        <a href={`/item/${hit.slug}`}>
          <div className="mt-6 aa-ItemContentTitle">
            <components.Highlight hit={hit} attribute="title" />
          </div>
          <div className="aa-ItemContentDescription">
            <components.Snippet hit={hit} attribute="description" />
          </div>
        </a>
      </div>
    </article>
  );
}

export default NavAutocomplete;
