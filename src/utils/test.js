const search = instantsearch({
  indexName: "Dev_Kaplan",
  searchClient: algoliasearch("ZLPYTBTZ4R", "be46d26dfdb299f9bee9146b63c99c77"),
  insights: true,
});

// Add widgets
// ...

search.start();
