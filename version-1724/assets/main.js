(function() {
    var toggle = document.querySelector('.mobile-toggle');
    var nav = document.querySelector('.main-nav');
    if (toggle && nav) {
        toggle.addEventListener('click', function() {
            nav.classList.toggle('is-open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var prev = document.querySelector('.hero-prev');
    var next = document.querySelector('.hero-next');
    var current = 0;

    function setSlide(index) {
        if (!slides.length) {
            return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function(slide, idx) {
            slide.classList.toggle('is-active', idx === current);
        });
        dots.forEach(function(dot, idx) {
            dot.classList.toggle('is-active', idx === current);
        });
    }

    if (slides.length) {
        setSlide(0);
        if (prev) {
            prev.addEventListener('click', function() {
                setSlide(current - 1);
            });
        }
        if (next) {
            next.addEventListener('click', function() {
                setSlide(current + 1);
            });
        }
        dots.forEach(function(dot, idx) {
            dot.addEventListener('click', function() {
                setSlide(idx);
            });
        });
        window.setInterval(function() {
            setSlide(current + 1);
        }, 5200);
    }

    var searchInput = document.querySelector('[data-filter-input]');
    var yearSelect = document.querySelector('[data-filter-year]');
    var regionSelect = document.querySelector('[data-filter-region]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-title]'));
    var empty = document.querySelector('.empty-state');

    function applyFilter() {
        if (!cards.length) {
            return;
        }
        var q = searchInput ? searchInput.value.trim().toLowerCase() : '';
        var year = yearSelect ? yearSelect.value : '';
        var region = regionSelect ? regionSelect.value : '';
        var visible = 0;

        cards.forEach(function(card) {
            var haystack = [
                card.getAttribute('data-title') || '',
                card.getAttribute('data-year') || '',
                card.getAttribute('data-region') || '',
                card.getAttribute('data-genre') || ''
            ].join(' ').toLowerCase();
            var ok = true;
            if (q && haystack.indexOf(q) === -1) {
                ok = false;
            }
            if (year && card.getAttribute('data-year') !== year) {
                ok = false;
            }
            if (region && (card.getAttribute('data-region') || '').indexOf(region) === -1) {
                ok = false;
            }
            card.classList.toggle('hide-card', !ok);
            if (ok) {
                visible += 1;
            }
        });

        if (empty) {
            empty.classList.toggle('is-visible', visible === 0);
        }
    }

    [searchInput, yearSelect, regionSelect].forEach(function(el) {
        if (el) {
            el.addEventListener('input', applyFilter);
            el.addEventListener('change', applyFilter);
        }
    });
})();
