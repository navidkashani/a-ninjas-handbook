"use strict";

// Initialize Algolia
const algoliaClient = algoliasearch(
  "ZT0GHFN926",
  "0f9293848ba54e9582d462783047ad3b"
);
const index = algoliaClient.initIndex("ninja");

// Search functionality
(function search() {
  // Cache references to the search elements
  var search_wrap = document.getElementById("search-wrapper"),
    searchbar = document.getElementById("searchbar"),
    searchbar_outer = document.getElementById("searchbar-outer"),
    searchresults = document.getElementById("searchresults"),
    searchresults_outer = document.getElementById("searchresults-outer"),
    searchresults_header = document.getElementById("searchresults-header"),
    searchicon = document.getElementById("search-toggle"),
    content = document.getElementById("content"),
    current_searchterm = "",
    SEARCH_HOTKEY_KEYCODE = 83, // 's'
    ESCAPE_KEYCODE = 27, // 'escape'
    DOWN_KEYCODE = 40, // 'down arrow'
    UP_KEYCODE = 38, // 'up arrow'
    SELECT_KEYCODE = 13; // 'enter'

  function hasFocus() {
    return searchbar === document.activeElement;
  }

  function removeChildren(elem) {
    while (elem.firstChild) {
      elem.removeChild(elem.firstChild);
    }
  }

  function formatSearchMetric(count, searchterm) {
    if (count === 1) {
      return count + " search result for '" + searchterm + "':";
    } else if (count === 0) {
      return "No search results for '" + searchterm + "'.";
    } else {
      return count + " search results for '" + searchterm + "':";
    }
  }

  function formatSearchResult(result) {
    const formatted_result = result._highlightResult.body.value;

    return (
      `<div style='direction:rtl;'>` +
      `<a href="${result.anchor}" aria-details="item_${result.objectID}">` +
      result.title +
      "</a>: " +
      '<span class="item" id="item_' +
      result.objectID +
      '" aria-label="Search Result">' +
      formatted_result +
      "</span>" +
      "</div>"
    );
  }

  // Function to handle Algolia search and display results
  function doSearch(searchterm) {
    if (current_searchterm === searchterm) return;
    current_searchterm = searchterm;

    // Call Algolia API to perform the search
    index
      .search(searchterm, {
        hitsPerPage: 10,
        attributesToRetrieve: ["title", "body", "anchor"],
        attributesToHighlight: ["title", "body"],
        highlightPreTag: '<span class="highlight">',
        highlightPostTag: "</span>",
        attributesToSnippet: "body:10", // Show 50 characters of the body
        exactOnSingleWordQuery: "word",
        snippetEllipsisText: "[&hellip;]",
      })
      .then(({ hits }) => {
        // Clear the previous results
        removeChildren(searchresults);

        // Display search metrics
        searchresults_header.innerText = formatSearchMetric(
          hits.length,
          searchterm
        );

        // Display each search result
        hits.forEach((hit) => {
          const resultElem = document.createElement("li");
          resultElem.innerHTML = formatSearchResult(hit);
          searchresults.appendChild(resultElem);
          // append resultElem to the body
          //   document.body.appendChild(resultElem);
        });

        // Show results if any

        if (hits.length > 0) {
          searchresults_outer.classList.remove("hidden");
        } else {
          searchresults_outer.classList.add("hidden");
        }
      });
  }

  // Event listener for keyup on the search bar
  searchbar.addEventListener("keyup", function () {
    var searchterm = searchbar.value.trim();
    if (searchterm !== "") {
      doSearch(searchterm);
    } else {
      removeChildren(searchresults);
    }
  });

  // Event listener for clicking the search icon
  searchicon.addEventListener("click", function () {
    search_wrap.classList.toggle("hidden");
    searchbar.focus();
  });
})();