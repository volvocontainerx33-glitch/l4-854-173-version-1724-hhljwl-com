(function () {
  var input = document.getElementById('globalSearchInput');
  var button = document.getElementById('globalSearchButton');
  var results = document.getElementById('globalSearchResults');
  var items = window.SEARCH_MOVIES || [];

  function getQueryFromUrl() {
    var params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function render(list) {
    results.innerHTML = list.map(function (item) {
      return [
        '<article class="movie-card compact" data-title="', item.title.replace(/"/g, '&quot;'), '">',
        '<a class="poster-link" href="', item.file, '">',
        '<img src="', item.cover, '" alt="', item.title.replace(/"/g, '&quot;'), '" loading="lazy">',
        '<span class="poster-play">▶</span>',
        '<span class="poster-year">', item.year, '</span>',
        '<span class="poster-type">', item.type, '</span>',
        '</a>',
        '<div class="card-body">',
        '<h3><a href="', item.file, '">', item.title, '</a></h3>',
        '<p>', item.oneLine, '</p>',
        '<div class="card-meta"><span>', item.region, '</span><span>', item.genre, '</span></div>',
        '<div class="tag-list"><span>', item.category, '</span></div>',
        '</div>',
        '</article>'
      ].join('');
    }).join('');
  }

  function search() {
    var query = normalize(input.value);

    if (!query) {
      render(items.slice(0, 48));
      return;
    }

    var list = items.filter(function (item) {
      return normalize([
        item.title,
        item.year,
        item.region,
        item.type,
        item.genre,
        item.category,
        item.oneLine
      ].join(' ')).indexOf(query) !== -1;
    }).slice(0, 120);

    render(list);
  }

  if (input && button && results) {
    input.value = getQueryFromUrl();
    button.addEventListener('click', search);
    input.addEventListener('input', search);
    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        search();
      }
    });
    search();
  }
})();
