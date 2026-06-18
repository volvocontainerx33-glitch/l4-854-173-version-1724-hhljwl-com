(function () {
    function all(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function closeSearch(results) {
        if (results) {
            results.classList.remove("is-open");
            results.innerHTML = "";
        }
    }

    function renderSearch(input) {
        var form = input.closest("form");
        var results = form ? form.querySelector("[data-search-results]") : null;
        var query = input.value.trim().toLowerCase();
        if (!results) {
            return;
        }
        if (!query) {
            closeSearch(results);
            return;
        }
        var list = (window.SEARCH_INDEX || []).filter(function (item) {
            return [item.title, item.year, item.region, item.genre, item.category]
                .join(" ")
                .toLowerCase()
                .indexOf(query) !== -1;
        }).slice(0, 12);
        if (!list.length) {
            results.innerHTML = '<div class="search-empty">没有匹配内容</div>';
            results.classList.add("is-open");
            return;
        }
        results.innerHTML = list.map(function (item) {
            return '<a href="./' + item.link + '"><strong>' + item.title + '</strong><span>' + item.year + ' · ' + item.region + ' · ' + item.genre + '</span></a>';
        }).join("");
        results.classList.add("is-open");
    }

    all("[data-site-search]").forEach(function (input) {
        input.addEventListener("input", function () {
            renderSearch(input);
        });
        input.addEventListener("focus", function () {
            renderSearch(input);
        });
        var form = input.closest("form");
        if (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                var first = form.querySelector("[data-search-results] a");
                if (first) {
                    window.location.href = first.getAttribute("href");
                }
            });
        }
    });

    document.addEventListener("click", function (event) {
        all("[data-search-results]").forEach(function (results) {
            if (!results.closest("form").contains(event.target)) {
                closeSearch(results);
            }
        });
    });

    var menuButton = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");
    if (menuButton && menu) {
        menuButton.addEventListener("click", function () {
            menu.classList.toggle("is-open");
        });
    }

    var slides = all("[data-hero-slide]");
    if (slides.length) {
        var dots = all("[data-hero-dot]");
        var current = 0;
        var show = function (index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === current);
            });
        };
        all("[data-hero-next]").forEach(function (button) {
            button.addEventListener("click", function () {
                show(current + 1);
            });
        });
        all("[data-hero-prev]").forEach(function (button) {
            button.addEventListener("click", function () {
                show(current - 1);
            });
        });
        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                show(i);
            });
        });
        window.setInterval(function () {
            show(current + 1);
        }, 5000);
    }

    function applyLocalFilter(scope) {
        var search = scope.querySelector("[data-card-search]");
        var year = scope.querySelector("[data-filter-year]");
        var type = scope.querySelector("[data-filter-type]");
        var cards = all(".movie-card", document);
        var query = search ? search.value.trim().toLowerCase() : "";
        var yearValue = year ? year.value : "";
        var typeValue = type ? type.value : "";
        cards.forEach(function (card) {
            var text = [card.dataset.title, card.dataset.genre, card.dataset.region, card.dataset.type, card.dataset.year].join(" ").toLowerCase();
            var matchQuery = !query || text.indexOf(query) !== -1;
            var matchYear = !yearValue || card.dataset.year === yearValue;
            var matchType = !typeValue || card.dataset.type.indexOf(typeValue) !== -1;
            card.classList.toggle("is-hidden", !(matchQuery && matchYear && matchType));
        });
    }

    all("[data-filter-panel]").forEach(function (panel) {
        all("input, select", panel).forEach(function (control) {
            control.addEventListener("input", function () {
                applyLocalFilter(panel);
            });
            control.addEventListener("change", function () {
                applyLocalFilter(panel);
            });
        });
    });

    all("[data-back-top]").forEach(function (button) {
        button.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    });
}());

function initPlayer(videoId, buttonId, source) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    if (!video || !button || !source) {
        return;
    }
    var attached = false;
    var hlsInstance = null;

    function attach() {
        if (attached) {
            return;
        }
        attached = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({ enableWorker: true });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
        } else {
            video.src = source;
        }
    }

    function play() {
        attach();
        button.classList.add("is-hidden");
        video.controls = true;
        var started = video.play();
        if (started && typeof started.catch === "function") {
            started.catch(function () {});
        }
    }

    button.addEventListener("click", play);
    video.addEventListener("click", function () {
        if (video.paused) {
            play();
        }
    });
    video.addEventListener("play", function () {
        button.classList.add("is-hidden");
    });
    window.addEventListener("pagehide", function () {
        if (hlsInstance) {
            hlsInstance.destroy();
            hlsInstance = null;
        }
    });
}
