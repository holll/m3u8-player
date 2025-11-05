function playM3u8(url) {
  if (Hls.isSupported()) {
    var video = document.getElementById("player");
    video.volume = 1.0;
    video.muted = true;
    const ctx = new AudioContext();
    const canAutoPlay = ctx.state === 'running';
    ctx.close();
    var hls = new Hls();
    var m3u8Url = decodeURIComponent(url);
    hls.loadSource(m3u8Url);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      video.play();
    });
    if (canAutoPlay) {
        video.muted = false;
    }
  }
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
  if (location.protocol === 'https:' && uri.indexOf('http://') === 0) {
    uri = 'https://' + uri.substr(7);
    alert('由于页面是https，播放地址已转换为https协议');
  }
  $(".s-input").val(uri);
  playM3u8(uri);
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
  var playUrl = inputField.val();
  if (location.protocol === 'https:' && playUrl.indexOf('http://') === 0) {
    playUrl = 'https://' + playUrl.substr(7);
    alert('由于页面是https，播放地址已转换为https协议');
    inputField.val(playUrl);
  }
  playM3u8(playUrl);
  return false;
});


