(function () {
  const menuButton = document.querySelector('[data-menu-button]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const prev = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    let index = 0;
    let timer = null;

    const show = function (nextIndex) {
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
    };

    const play = function () {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    };

    const reset = function () {
      window.clearInterval(timer);
      play();
    };

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        reset();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        reset();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        reset();
      });
    }

    show(0);
    play();
  }

  const filterPanel = document.querySelector('[data-filter-panel]');

  if (filterPanel) {
    const searchInput = filterPanel.querySelector('[data-search-input]');
    const yearSelect = filterPanel.querySelector('[data-year-filter]');
    const typeSelect = filterPanel.querySelector('[data-type-filter]');
    const cards = Array.from(document.querySelectorAll('[data-movie-card]'));
    const emptyState = document.querySelector('[data-empty-state]');
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q') || '';

    if (searchInput && initialQuery) {
      searchInput.value = initialQuery;
    }

    const textOf = function (card) {
      return [
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-type'),
        card.getAttribute('data-year'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-category'),
        card.textContent
      ].join(' ').toLowerCase();
    };

    const apply = function () {
      const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
      const year = yearSelect ? yearSelect.value : '';
      const type = typeSelect ? typeSelect.value : '';
      let visible = 0;

      cards.forEach(function (card) {
        const matchesQuery = !query || textOf(card).includes(query);
        const matchesYear = !year || card.getAttribute('data-year') === year;
        const matchesType = !type || (card.getAttribute('data-type') || '').includes(type);
        const ok = matchesQuery && matchesYear && matchesType;
        card.style.display = ok ? '' : 'none';
        if (ok) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle('show', visible === 0);
      }
    };

    [searchInput, yearSelect, typeSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });

    apply();
  }

  const player = document.querySelector('[data-player]');

  if (player) {
    const video = player.querySelector('video');
    const button = player.querySelector('[data-play-button]');
    let initialized = false;
    let hlsInstance = null;

    const attach = function () {
      if (!video || initialized) {
        return;
      }

      const source = video.getAttribute('data-src');

      if (!source) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        initialized = true;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          if (button && button.classList.contains('is-hidden')) {
            const attempt = video.play();
            if (attempt && typeof attempt.catch === 'function') {
              attempt.catch(function () {});
            }
          }
        });
        initialized = true;
      }
    };

    const start = function () {
      attach();
      if (button) {
        button.classList.add('is-hidden');
      }
      if (video) {
        const attempt = video.play();
        if (attempt && typeof attempt.catch === 'function') {
          attempt.catch(function () {});
        }
      }
    };

    if (button) {
      button.addEventListener('click', start);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (!initialized || video.paused) {
          start();
        }
      });
      video.addEventListener('play', function () {
        if (button) {
          button.classList.add('is-hidden');
        }
      });
    }
  }
})();
