function initMoviePlayer(streamUrl) {
    var video = document.getElementById('movieVideo');
    var overlay = document.getElementById('playOverlay');
    var hlsInstance = null;

    function bindSource() {
        if (!video) {
            return;
        }
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            if (!video.getAttribute('src')) {
                video.src = streamUrl;
            }
        } else if (window.Hls && window.Hls.isSupported()) {
            if (!hlsInstance) {
                hlsInstance = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
            }
        } else if (!video.getAttribute('src')) {
            video.src = streamUrl;
        }
    }

    function startPlay() {
        bindSource();
        if (overlay) {
            overlay.classList.add('is-hidden');
        }
        var promise = video.play();
        if (promise && promise.catch) {
            promise.catch(function() {});
        }
    }

    if (overlay) {
        overlay.addEventListener('click', startPlay);
    }
    if (video) {
        video.addEventListener('click', function() {
            if (video.paused) {
                startPlay();
            }
        });
    }
}
