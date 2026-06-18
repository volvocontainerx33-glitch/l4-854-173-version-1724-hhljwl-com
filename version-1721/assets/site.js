(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setupMenu() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var menu = document.querySelector("[data-mobile-menu]");
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener("click", function () {
            menu.classList.toggle("open");
        });
    }

    function setupHero() {
        var root = document.querySelector("[data-hero]");
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
        var active = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === active);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === active);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(active + 1);
            }, 5000);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                var next = Number(dot.getAttribute("data-hero-dot") || 0);
                show(next);
                start();
            });
        });

        root.addEventListener("mouseenter", stop);
        root.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function setupSearch() {
        var panels = Array.prototype.slice.call(document.querySelectorAll("[data-search-panel]"));
        panels.forEach(function (panel) {
            var scope = panel.closest(".catalog-scope") || document;
            var input = panel.querySelector("[data-search]");
            var buttons = Array.prototype.slice.call(panel.querySelectorAll("[data-filter]"));
            var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));
            var activeFilter = "";

            function textFor(card) {
                return [
                    card.getAttribute("data-title") || "",
                    card.getAttribute("data-region") || "",
                    card.getAttribute("data-type") || "",
                    card.getAttribute("data-year") || "",
                    card.getAttribute("data-genre") || "",
                    card.getAttribute("data-tags") || ""
                ].join(" ").toLowerCase();
            }

            function apply() {
                var query = input ? input.value.trim().toLowerCase() : "";
                cards.forEach(function (card) {
                    var haystack = textFor(card);
                    var queryMatch = !query || haystack.indexOf(query) !== -1;
                    var filterMatch = !activeFilter || haystack.indexOf(activeFilter.toLowerCase()) !== -1;
                    card.classList.toggle("hidden-by-search", !(queryMatch && filterMatch));
                });
            }

            if (input) {
                input.addEventListener("input", apply);
            }

            buttons.forEach(function (button) {
                button.addEventListener("click", function () {
                    buttons.forEach(function (item) {
                        item.classList.remove("active");
                    });
                    button.classList.add("active");
                    activeFilter = button.getAttribute("data-filter") || "";
                    apply();
                });
            });
        });
    }

    function setupPlayers() {
        var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
        players.forEach(function (shell) {
            var video = shell.querySelector("video");
            var overlay = shell.querySelector(".play-overlay");
            var instance = null;
            var attached = false;

            if (!video) {
                return;
            }

            function getUrl() {
                var sourceElement = video.querySelector("source");
                if (sourceElement && sourceElement.src) {
                    return sourceElement.src;
                }
                return video.currentSrc || video.src;
            }

            function attachMedia() {
                if (attached) {
                    return;
                }
                var url = getUrl();
                if (!url) {
                    return;
                }
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    if (!video.src) {
                        video.src = url;
                    }
                    attached = true;
                    return;
                }
                if (window.Hls && window.Hls.isSupported()) {
                    instance = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    instance.loadSource(url);
                    instance.attachMedia(video);
                    attached = true;
                    return;
                }
                if (!video.src) {
                    video.src = url;
                }
                attached = true;
            }

            function play() {
                attachMedia();
                shell.classList.add("is-started");
                var attempt = video.play();
                if (attempt && typeof attempt.catch === "function") {
                    attempt.catch(function () {});
                }
            }

            if (overlay) {
                overlay.addEventListener("click", play);
            }

            video.addEventListener("click", function () {
                if (video.paused) {
                    play();
                }
            });
        });
    }

    ready(function () {
        setupMenu();
        setupHero();
        setupSearch();
        setupPlayers();
    });
})();
