console.log("content script loaded");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );
  if (request.ram === "ram") {
    console.log("content script received a message", request);
    if (request.search) findWord(request.search);
    if (request.clearSearch) removeHighlighted();
    sendResponse({ jaiShreeRam: "jaiShreeRam" });
  }
});

function findWord(wordsArray) {
  //
  const word = new RegExp(wordsArray.join("|"), "gi");
  console.log("find Word called");
  const allElements = Array.from(
    document.querySelectorAll(
      `body *:not(style):not(noscript):not(script):not(textarea):not(a):not(input)`
    )
  ).filter((element) => {
    if (element.tagName == "A") return false;
    if (element.tagName == "IMG") return false;
    return true;
  });
  // returns all the nodes that have the word and are text nodes(not the parents of the text node)
  // el.nodeType ===3 means element is a text node

  // console.log("allElements", allElements);

  const foundElements = Array.from(allElements).filter((el) => {
    return word.test(getTextOfElement(el));
  });
  // console.log("foundElements", foundElements);
  // if (document.querySelector("._highlighted")) removeHighlighted();
  // wrap found words in span
  highlightElements(foundElements, word);
}
function getTextOfElement(element) {
  var selected = element.cloneNode(true);
  var text;
  while (selected.firstChild) {
    if (selected.firstChild.nodeType == 3)
      text += selected.firstChild.nodeValue;
    selected.removeChild(selected.firstChild);
  }
  return text;
}

function wrapWordInSpan(element, searchTerm) {
  const regex = new RegExp(searchTerm, "gi");
  element.innerHTML = element.innerHTML.replace(regex, function (match) {
    return '<span class="_highlighted">' + match + "</span>";
  });
}

function unwrapWordFromSpan(spanElement) {
  if (
    spanElement.classList.contains("_highlighted") &&
    spanElement.tagName == "SPAN"
  ) {
    var parentElement = spanElement.parentNode;
    var textNode = document.createTextNode(spanElement.textContent);
    parentElement.replaceChild(textNode, spanElement);
  }
}

function highlightElements(foundElements, word) {
  foundElements.forEach((el) => {
    wrapWordInSpan(el, word);
  });
}

function removeHighlighted() {
  console.log("removing highlighted");
  document
    .querySelectorAll("span._highlighted")
    .forEach((el) => unwrapWordFromSpan(el));
}
