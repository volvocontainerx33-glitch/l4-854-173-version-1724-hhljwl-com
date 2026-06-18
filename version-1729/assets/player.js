(function () {
  var hlsPromise = null;

  function loadHls() {
    if (window.Hls) {
      return Promise.resolve(window.Hls);
    }

    if (hlsPromise) {
      return hlsPromise;
    }

    hlsPromise = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.6.15/dist/hls.min.js';
      script.async = true;
      script.onload = function () {
        resolve(window.Hls);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });

    return hlsPromise;
  }

  window.setupPlayer = function (shellId, source) {
    var shell = document.getElementById(shellId);

    if (!shell) {
      return;
    }

    var video = shell.querySelector('video');
    var cover = shell.querySelector('[data-player-cover]');
    var isReady = false;

    function reveal() {
      if (cover) {
        cover.classList.add('hidden');
      }
    }

    function playVideo() {
      reveal();
      var promise = video.play();

      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    function prepare() {
      if (isReady) {
        playVideo();
        return;
      }

      isReady = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        playVideo();
        return;
      }

      loadHls()
        .then(function (Hls) {
          if (Hls && Hls.isSupported()) {
            var hls = new Hls({ enableWorker: true });
            hls.loadSource(source);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, playVideo);
          } else {
            video.src = source;
            playVideo();
          }
        })
        .catch(function () {
          video.src = source;
          playVideo();
        });
    }

    if (cover) {
      cover.addEventListener('click', prepare);
    }

    video.addEventListener('click', function () {
      if (!isReady) {
        prepare();
      }
    });
  };
})();
