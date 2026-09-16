(function () {
  "use strict";

  var drawers = document.querySelectorAll("details.nav-drawer");
  drawers.forEach(function (drawer) {
    drawer.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        drawer.removeAttribute("open");
      });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") drawer.removeAttribute("open");
    });
  });

  var search = document.getElementById("help-search");
  if (!search) return;

  var items = Array.prototype.slice.call(document.querySelectorAll("[data-search]"));
  var empty = document.getElementById("search-empty");
  var count = document.getElementById("search-count");

  function normalize(value) {
    return (value || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function applyQuery(raw) {
    var query = normalize(raw);
    var visible = 0;
    items.forEach(function (item) {
      var haystack = normalize(item.getAttribute("data-search") + " " + item.textContent);
      var show = !query || haystack.indexOf(query) !== -1;
      item.setAttribute("data-search-hidden", show ? "false" : "true");
      if (show) visible += 1;
    });
    if (empty) empty.classList.toggle("is-visible", visible === 0);
    if (count) {
      count.textContent = query
        ? visible + (count.getAttribute("data-found-label") || " found")
        : count.getAttribute("data-all-label") || "";
    }
    var url = new URL(window.location.href);
    if (query) url.searchParams.set("q", raw.trim());
    else url.searchParams.delete("q");
    history.replaceState(null, "", url.pathname + url.search + url.hash);
  }

  var params = new URLSearchParams(window.location.search);
  if (params.get("q")) {
    search.value = params.get("q");
  }
  applyQuery(search.value);
  search.addEventListener("input", function () {
    applyQuery(search.value);
  });
})();
