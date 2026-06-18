function initVideoPlayer(videoUrl) {
    var video = document.querySelector('[data-video-player]');
    var button = document.querySelector('[data-play-button]');
    var frame = document.querySelector('[data-player-frame]');
    var hlsInstance = null;
    var started = false;

    if (!video || !button || !videoUrl) {
        return;
    }

    function attachVideo() {
        if (started) {
            return;
        }

        started = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = videoUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: false
            });
            hlsInstance.loadSource(videoUrl);
            hlsInstance.attachMedia(video);
        } else {
            video.src = videoUrl;
        }
    }

    function playVideo() {
        attachVideo();
        button.classList.add('hidden');
        var playPromise = video.play();

        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {
                button.classList.remove('hidden');
            });
        }
    }

    button.addEventListener('click', playVideo);

    if (frame) {
        frame.addEventListener('click', function (event) {
            if (event.target === video && video.paused) {
                playVideo();
            }
        });
    }

    video.addEventListener('play', function () {
        button.classList.add('hidden');
    });

    video.addEventListener('pause', function () {
        if (!video.ended) {
            button.classList.remove('hidden');
        }
    });

    video.addEventListener('ended', function () {
        button.classList.remove('hidden');
    });
}
