export function mobileNow() {
  var userAgent = (navigator.userAgent || "").toLowerCase();
  var mobileKeywords = [
    /iphone/i,
    /ipad/i,
    /ipod/i,
    /android/i,
    /blackberry/i,
    /windows phone/i,
  ];

  var isMobileUA = mobileKeywords.some(function (keyword) {
    return userAgent.match(keyword);
  });

  var platform = (navigator.platform || "").toLowerCase();
  var desktopTokens = ["win16", "win32", "win64", "mac", "macintel", "linux"];

  var isDesktopPlatform = desktopTokens.some(function (t) {
    return platform.indexOf(t) !== -1;
    // 또는: return platform.includes(t);
  });

  return !!(isMobileUA && !isDesktopPlatform);
}

$(document).ready(function () {
  if (!mobileNow()) {
    var x = $(window).width();
    if (x > 1000) {
      x = 700;
    }
    $("#base").width(x);
    $("#base_outer").css({
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    });
  }
  $("#startboard").show();
});
