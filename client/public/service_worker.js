console.log("service worker is running...");
// service working message passing is available in addition to extension message passing, but the two systems are not interoperable.
// extension messaging is supported in service workers
// extension messaging- chrome.runtime.sendMessage() & chrome.runtime.onMessage
// service worker messaging- chrome.runtime.postMessage() & ServiceWorkerGlobal.message

// chrome.action.onClicked.addEventListener(() => {
//   console.log("clicked");
//   chrome.tabs.sendMessage();
// });

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.tabs.create({ url: "https://www.google.com/search?q=find+words" });
  }
});
