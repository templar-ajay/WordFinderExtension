export function sendMessage(type, data) {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        ram: "ram",
        type: type,
        data: data,
      },
      function (response) {
        if (response) console.log(response);
      }
    );
  });
}

export async function getKeywords() {
  const { keywords } = await chrome.storage.local.get(["keywords"]);
  return keywords ? keywords : [];
}

export async function saveKeywords(keywords) {
  chrome.storage.local.set({ keywords: keywords }, function () {
    getKeywords().then((keywords) => console.log("getKeywords()", keywords));
  });
}
