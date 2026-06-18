(function() {
    var input = document.getElementById('globalSearchInput');
    var container = document.getElementById('globalSearchResults');
    if (!input || !container || !window.SITE_MOVIES && typeof SITE_MOVIES === 'undefined') {
        return;
    }

    function render(items) {
        container.innerHTML = items.slice(0, 120).map(function(item) {
            return '' +
                '<article class="movie-card" data-title="' + item.title + '" data-year="' + item.year + '" data-region="' + item.region + '" data-genre="' + item.genre + '">' +
                '<a class="poster" href="' + item.url + '">' +
                '<img src="' + item.cover + '" alt="' + item.title + '" loading="lazy">' +
                '<span class="play-mark">▶</span>' +
                '</a>' +
                '<div class="movie-info">' +
                '<h3><a href="' + item.url + '">' + item.title + '</a></h3>' +
                '<p class="meta">' + item.year + ' · ' + item.region + '</p>' +
                '<p class="desc">' + item.oneLine + '</p>' +
                '</div>' +
                '</article>';
        }).join('');
    }

    function search() {
        var q = input.value.trim().toLowerCase();
        if (!q) {
            render(SITE_MOVIES.slice(0, 48));
            return;
        }
        var items = SITE_MOVIES.filter(function(item) {
            return [item.title, item.year, item.region, item.genre, item.oneLine].join(' ').toLowerCase().indexOf(q) !== -1;
        });
        render(items);
    }

    input.addEventListener('input', search);
    search();
})();
