chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (details.url.includes("/Scripts/Panopto/Bundles/Viewer.js")) {
      return { redirectUrl: chrome.extension.getURL("Viewer.js")};
    }
  },
  { urls: ["*://kocuni.hosted.panopto.com/Panopto/Cache/*/Scripts/Panopto/Bundles/Viewer.js"] },
  ["blocking"]);