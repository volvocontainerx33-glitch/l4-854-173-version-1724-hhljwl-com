(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            mobilePanel.classList.toggle('open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === index);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === index);
            });
        }

        function startTimer() {
            clearInterval(timer);
            timer = setInterval(function () {
                showSlide(index + 1);
            }, 5000);
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
                startTimer();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(index - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(index + 1);
                startTimer();
            });
        }

        showSlide(0);
        startTimer();
    }

    var searchForm = document.querySelector('[data-search-form]');
    var searchInput = document.querySelector('[data-search-input]');
    var resultSection = document.querySelector('[data-search-results-section]');
    var defaultSection = document.querySelector('[data-search-default]');
    var resultGrid = document.querySelector('[data-search-results]');
    var resultTitle = document.querySelector('[data-search-title]');
    var resultSubtitle = document.querySelector('[data-search-subtitle]');

    function getQuery() {
        var params = new URLSearchParams(window.location.search);
        return (params.get('q') || '').trim();
    }

    function normalize(text) {
        return String(text || '').toLowerCase().replace(/\s+/g, '');
    }

    function movieCard(movie) {
        return [
            '<a class="movie-card" href="./' + movie.file + '">',
            '    <div class="poster-wrap">',
            '        <img src="' + movie.image + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
            '        <div class="poster-gradient"></div>',
            '        <div class="play-hover" aria-hidden="true">▶</div>',
            '        <span class="rating">★ ' + movie.rating + '</span>',
            '    </div>',
            '    <h3>' + escapeHtml(movie.title) + '</h3>',
            '    <div class="movie-meta">',
            '        <span>' + escapeHtml(movie.year) + '</span>',
            '        <span>' + escapeHtml(movie.type) + '</span>',
            '    </div>',
            '</a>'
        ].join('');
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function renderSearch(query) {
        if (!resultGrid || typeof SEARCH_MOVIES === 'undefined') {
            return;
        }

        var normalized = normalize(query);

        if (!normalized) {
            if (resultSection) {
                resultSection.hidden = true;
            }
            if (defaultSection) {
                defaultSection.hidden = false;
            }
            return;
        }

        var results = SEARCH_MOVIES.filter(function (movie) {
            return normalize(movie.title + movie.region + movie.type + movie.year + movie.genre + movie.tags).indexOf(normalized) !== -1;
        }).slice(0, 120);

        if (searchInput) {
            searchInput.value = query;
        }

        if (defaultSection) {
            defaultSection.hidden = true;
        }

        if (resultSection) {
            resultSection.hidden = false;
        }

        if (resultTitle) {
            resultTitle.textContent = '“' + query + '”相关内容';
        }

        if (resultSubtitle) {
            resultSubtitle.textContent = results.length ? '已为你匹配到相关条目。' : '暂未匹配到内容，可以尝试更换关键词。';
        }

        resultGrid.innerHTML = results.map(movieCard).join('');
    }

    if (searchForm) {
        searchForm.addEventListener('submit', function (event) {
            event.preventDefault();
            var query = searchInput ? searchInput.value.trim() : '';
            var url = query ? './search.html?q=' + encodeURIComponent(query) : './search.html';
            window.history.replaceState(null, '', url);
            renderSearch(query);
        });

        renderSearch(getQuery());
    }
})();
