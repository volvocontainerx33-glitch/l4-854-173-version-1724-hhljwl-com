(function () {
  var navButton = document.querySelector('[data-nav-toggle]');
  var navMenu = document.querySelector('[data-nav-menu]');
  var navExtra = document.querySelector('[data-nav-menu-extra]');

  if (navButton && navMenu) {
    navButton.addEventListener('click', function () {
      navMenu.classList.toggle('is-open');
      if (navExtra) {
        navExtra.classList.toggle('is-open');
      }
    });
  }

  var backTop = document.querySelector('[data-back-top]');
  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, position) {
        slide.classList.toggle('is-active', position === current);
      });
      dots.forEach(function (dot, position) {
        dot.classList.toggle('is-active', position === current);
      });
    }

    function startHero() {
      stopHero();
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    function stopHero() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot') || 0));
        startHero();
      });
    });

    hero.addEventListener('mouseenter', stopHero);
    hero.addEventListener('mouseleave', startHero);
    showSlide(0);
    startHero();
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function itemText(item) {
    return normalize([
      item.getAttribute('data-title'),
      item.getAttribute('data-region'),
      item.getAttribute('data-type'),
      item.getAttribute('data-year'),
      item.getAttribute('data-tags'),
      item.textContent
    ].join(' '));
  }

  function filterItems(container, query, region, year) {
    var items = Array.prototype.slice.call(container.querySelectorAll('.searchable-item'));
    var q = normalize(query);
    var r = normalize(region);
    var y = normalize(year);

    items.forEach(function (item) {
      var matchesQuery = !q || itemText(item).indexOf(q) !== -1;
      var matchesRegion = !r || normalize(item.getAttribute('data-region')) === r;
      var matchesYear = !y || normalize(item.getAttribute('data-year')) === y;
      item.classList.toggle('is-hidden-by-filter', !(matchesQuery && matchesRegion && matchesYear));
    });
  }

  var localSearch = document.querySelector('[data-local-search]');
  if (localSearch) {
    var localContainer = document.querySelector('[data-filter-container]');
    localSearch.addEventListener('input', function () {
      if (localContainer) {
        filterItems(localContainer, localSearch.value, '', '');
      }
    });
  }

  var globalSearch = document.querySelector('[data-global-search]');
  var regionFilter = document.querySelector('[data-filter-region]');
  var yearFilter = document.querySelector('[data-filter-year]');
  var resetFilter = document.querySelector('[data-reset-filter]');
  var globalContainer = document.querySelector('[data-filter-container]');

  function applyGlobalFilter() {
    if (!globalContainer) {
      return;
    }
    filterItems(
      globalContainer,
      globalSearch ? globalSearch.value : '',
      regionFilter ? regionFilter.value : '',
      yearFilter ? yearFilter.value : ''
    );
  }

  if (globalSearch && globalContainer) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q');
    if (query) {
      globalSearch.value = query;
    }
    globalSearch.addEventListener('input', applyGlobalFilter);
    if (regionFilter) {
      regionFilter.addEventListener('change', applyGlobalFilter);
    }
    if (yearFilter) {
      yearFilter.addEventListener('change', applyGlobalFilter);
    }
    if (resetFilter) {
      resetFilter.addEventListener('click', function () {
        globalSearch.value = '';
        if (regionFilter) {
          regionFilter.value = '';
        }
        if (yearFilter) {
          yearFilter.value = '';
        }
        applyGlobalFilter();
      });
    }
    applyGlobalFilter();
  }

  function initializePlayer(frame) {
    var video = frame.querySelector('video');
    var button = frame.querySelector('.video-overlay');
    var source = frame.getAttribute('data-m3u8');
    var ready = false;
    var hlsInstance = null;

    if (!video || !source) {
      return;
    }

    function attachSource() {
      if (ready) {
        return;
      }
      ready = true;

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({ enableWorker: true });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else {
        video.src = source;
      }
    }

    function playVideo() {
      attachSource();
      frame.classList.add('is-playing');
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          frame.classList.remove('is-playing');
        });
      }
    }

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        playVideo();
      });
    }

    frame.addEventListener('click', function (event) {
      if (event.target === video) {
        return;
      }
      playVideo();
    });

    video.addEventListener('play', function () {
      frame.classList.add('is-playing');
    });

    video.addEventListener('pause', function () {
      if (video.currentTime === 0 || video.ended) {
        frame.classList.remove('is-playing');
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-m3u8]')).forEach(initializePlayer);
})();
