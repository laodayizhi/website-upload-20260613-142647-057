import { H as Hls } from './video-vendor-dru42stk.js';

function startVideo(video, button) {
  var source = video.getAttribute('data-source');
  if (!source) {
    return;
  }

  if (button) {
    button.classList.add('is-hidden');
  }

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    if (!video.src) {
      video.src = source;
    }
    video.controls = true;
    video.play().catch(function () {});
    return;
  }

  if (Hls && Hls.isSupported()) {
    if (!video.__hlsInstance) {
      var hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      video.__hlsInstance = hls;
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.controls = true;
        video.play().catch(function () {});
      });
    } else {
      video.controls = true;
      video.play().catch(function () {});
    }
  }
}

Array.prototype.slice.call(document.querySelectorAll('.video-frame')).forEach(function (frame) {
  var video = frame.querySelector('.movie-player');
  var button = frame.querySelector('.player-cover');

  if (!video) {
    return;
  }

  if (button) {
    button.addEventListener('click', function () {
      startVideo(video, button);
    });
  }

  video.addEventListener('click', function () {
    startVideo(video, button);
  });
});
