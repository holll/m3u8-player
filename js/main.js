var currentHls = null;

function getAutoPlayPermission() {
  var canAutoPlay = false;
  var AudioContextRef = window.AudioContext || window.webkitAudioContext;
  if (AudioContextRef) {
    var ctx = new AudioContextRef();
    canAutoPlay = ctx.state === "running";
    ctx.close();
  }
  return canAutoPlay;
}

function handlePlayPromise(playPromise, video, canAutoPlay) {
  if (playPromise && typeof playPromise.then === "function") {
    playPromise
      .then(function () {
        if (canAutoPlay) {
          video.muted = false;
        }
      })
      .catch(function () {});
  }
}

function normalizeUrl(rawUrl) {
  if (!rawUrl) {
    return "";
  }
  var trimmedUrl = rawUrl.trim();
  if (!trimmedUrl) {
    return "";
  }
  if (location.protocol === "https:" && trimmedUrl.indexOf("http://") === 0) {
    alert("由于页面是https，播放地址已转换为https协议");
    return "https://" + trimmedUrl.substr(7);
  }
  return trimmedUrl;
}

function playM3u8(url) {
  var m3u8Url = decodeURIComponent(url || "");
  if (!m3u8Url) {
    return;
  }
  var video = document.getElementById("player");
  video.volume = 1.0;
  video.muted = true;
  var canAutoPlay = getAutoPlayPermission();

  if (currentHls) {
    currentHls.destroy();
    currentHls = null;
  }

  if (Hls.isSupported()) {
    currentHls = new Hls();
    currentHls.loadSource(m3u8Url);
    currentHls.attachMedia(video);
    currentHls.on(Hls.Events.MANIFEST_PARSED, function () {
      var playPromise = video.play();
      handlePlayPromise(playPromise, video, canAutoPlay);
    });
    return;
  }

  if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = m3u8Url;
    video.addEventListener("loadedmetadata", function onLoadedMetadata() {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      var playPromise = video.play();
      handlePlayPromise(playPromise, video, canAutoPlay);
    });
    return;
  }

  alert("当前浏览器不支持HLS播放，请更换浏览器后重试");
}
var uri = window.location.href.split("#")[1];
if (uri != null) {
  $(
    "header,footer,.logo,.input-div,.am-text-right,.am-alert-secondary"
  ).remove();
  $("#player,.am-container,body,html").css({
    height: "100%",
    width: "100%",
    margin: "0",
    padding: "0",
  });
  $(".am-container").removeClass("am-container");
  var normalizedUri = normalizeUrl(uri);
  $(".s-input").val(normalizedUri);
  playM3u8(normalizedUri);
//   setTimeout(function () {
//     $("html,body").animate(
//       {
//         scrollTop: $(".input-div").offset().top - 20,
//       },
//       200
//     );
//   }, 3000);
}
$("#str-post").submit(function () {
  $("html,body").animate(
    {
      scrollTop: $(".input-div").offset().top - 20,
    },
    200
  );
  var inputField = $("#str-post input[name='url']");
  var playUrl = normalizeUrl(inputField.val());
  if (!playUrl) {
    alert("请输入有效的播放地址");
    return false;
  }
  inputField.val(playUrl);
  playM3u8(playUrl);
  return false;
});

