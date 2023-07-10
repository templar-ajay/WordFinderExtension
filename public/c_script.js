console.log("content script loaded");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );
  if (request.ram === "ram") {
    console.log("content script received a message", request);
    switch (request.type) {
      case "search":
        findWords(request.data);
        break;
      case "clearSearch":
        removeHighlighted();
        break;
      case "moveHighlighted":
        moveCurrentHighlighted(request.data);
        break;
      // code block
    }

    sendResponse({ jaiShreeRam: "jaiShreeRam" });
  }
});

function findWords(wordsArray) {
  // to find words in pdf file
  const embedElement = document.querySelector("embed[type='application/pdf']");
  if (embedElement) {
    console.log(embedElement);
    // contentScript.js
    changeTextBackgroundColor();
    // Function to change the background color of a specific text element
    function changeTextBackgroundColor() {
      const targetText = "hi"; // Replace with the actual text you want to highlight
      const backgroundColor = "red"; // Replace with the desired background color
    }
  } else {
    // to find words in web page
    const wordsRegex = new RegExp(wordsArray.join("|"), "gi");
    console.log("find Word called");
    const allElements = Array.from(
      document.querySelectorAll(
        `body *:not(style):not(noscript):not(script):not(textarea):not(a):not(input)`
      )
    ).filter((element) => {
      if (element.tagName == "A") return false;
      if (element.tagName == "IMG") return false;
      if (element.style.display == "none") return false;
      if (!element.checkVisibility()) return false;
      return true;
    });
    // el.nodeType ===3 means element is a text node

    // console.log("allElements", allElements);

    const foundElements = Array.from(allElements).filter((el) => {
      return wordsRegex.test(getTextOfElement(el));
    });
    // console.log("foundElements", foundElements);
    // wrap found words in span
    highlightElements(foundElements, wordsRegex);
    currentHighlightFirst();
  }
}

function currentHighlightFirst() {
  const firstElement = document.querySelector("._highlighted");
  firstElement.classList.add("_current-highlighted");
  scrollElementIntoView(firstElement);
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

function highlightElements(foundElements, wordsRegex) {
  foundElements.forEach((el) => {
    wrapWordInSpan(el, wordsRegex);
  });
}

function removeHighlighted() {
  console.log("removing highlighted");
  document
    .querySelectorAll("span._highlighted")
    .forEach((el) => unwrapWordFromSpan(el));
}

function moveCurrentHighlighted(direction) {
  console.log("moveCurrentHighlighted called");
  const allHighlighted = Array.from(
    document.getElementsByClassName("_highlighted")
  );

  console.log(`allHighlighted`, allHighlighted);
  // map ke baad filter lagana tha bhut time lag gya
  const currentHighlightedIndex = allHighlighted
    .map((x, i) => {
      if (x.classList.contains("_current-highlighted")) return i;
    })
    .filter((x) => x == 0 || x)[0];
  console.log("currentHighlightedIndex", currentHighlightedIndex);

  console.log(`current Highlighted`, allHighlighted[currentHighlightedIndex]);

  allHighlighted[currentHighlightedIndex].classList.remove(
    "_current-highlighted"
  );
  console.log("removed _current-highlighted");

  const nextIndex =
    direction == "next"
      ? allHighlighted.length - 1 > currentHighlightedIndex
        ? currentHighlightedIndex + 1
        : 0
      : 0 < currentHighlightedIndex
      ? currentHighlightedIndex - 1
      : allHighlighted.length - 1;
  console.log("nextIndex", nextIndex);
  allHighlighted[nextIndex].classList.add("_current-highlighted");
  scrollElementIntoView(allHighlighted[nextIndex]);
  console.log("added current-highlighted to ", allHighlighted[nextIndex]);
}

function scrollElementIntoView(el) {
  el.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "nearest",
  });
}
