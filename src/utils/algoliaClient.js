import algoliasearch from "algoliasearch/lite";
import instantsearch from "instantsearch.js";

import { carousel } from "instantsearch.js/es/templates";
import {
  configure,
  hits,
  pagination,
  panel,
  refinementList,
  searchBox,
  trendingItems,
} from "instantsearch.js/es/widgets";
import "instantsearch.css/themes/satellite.css";

const searchClient = algoliasearch(
  "ZLPYTBTZ4R",
  "be46d26dfdb299f9bee9146b63c99c77",
);

const search = instantsearch({
  indexName: "Dev_Kaplan",
  searchClient,
  insights: true,
});

search.addWidgets([
  searchBox({
    container: "#searchbox",
  }),

  hits({
    container: "#hits",
    templates: {
      item: `
        <div>
          <a href="{{url}}" class="block transition-shadow duration-300 hover:shadow-lg">
            <img src="{{thumbnail}}" alt="{{title}}" />
            <h2>{{title}}</h2>
          </a>
        </div>
      `,
    },
  }),
]);

search.start();
