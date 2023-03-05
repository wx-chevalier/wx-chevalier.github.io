const search = instantsearch({
  indexName: "docs",
  searchClient: instantMeiliSearch(
    "https://meili.search.unionfab.com",
    "e99221c5382010ea36df3f1489267d606a0fd52d23dfc1ab1182c6e66fd5eab6",
    {
      limitPerRequest: 30,
    }
  ),
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: "#searchbox",
  }),

  instantsearch.widgets.clearRefinements({
    container: "#clear-refinements",
  }),

  instantsearch.widgets.refinementList({
    container: "#categories-list",
    attribute: "repo",
  }),

  instantsearch.widgets.refinementList({
    container: "#categories-list",
    attribute: "repo",
  }),

  instantsearch.widgets.configure({
    hitsPerPage: 6,
    snippetEllipsisText: "...",
    attributesToSnippet: ["description:50"],
  }),

  instantsearch.widgets.hits({
    container: "#hits",
    templates: {
      item: `
        <div>
          <div class="hit-name">
            {{#helpers.highlight}}{ "attribute": "fileName" }{{/helpers.highlight}}
          </div>
          <div class="hit-description">
            {{#helpers.snippet}}{ "attribute": "desc" }{{/helpers.snippet}}
          </div>
          <div class="hit-info">描述: {{content}}</div>
        </div>
      `,
    },
  }),

  instantsearch.widgets.pagination({
    container: "#pagination",
  }),
]);

search.start();
