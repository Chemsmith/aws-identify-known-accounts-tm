// ==UserScript==
// @name         Identify known AWS accounts
// @namespace    https://github.com/willdady/aws-identify-known-accounts-tm
// @version      2023-12-17
// @description  Shows the AWS account name for AWS account ids found on the page
// @author       Will Dady
// @match        https://*/*
// @icon         data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>✨</text></svg>
// @run-at context-menu
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const DEFAULT_BACKGROUND_COLOR = "yellow";
  const DEFAULT_TEXT_COLOR = "#333";

  const ACCOUNTS = [
    {
      accountId: /111122223333/,
      accountName: "My Account",
    },
  ];

  function highlightText(element) {
    // Check if the element is a text node. We also ignore the element if it has
    // the attribute `data-tampered="true"` as that indicates we have already
    // made changes to the element's children.
    if (
      element.nodeType === 3 &&
      element.parentNode.dataset.tampered !== "true"
    ) {
      const text = element.nodeValue;
      for (const { accountId, accountName, backgroundColor, textColor } of ACCOUNTS) {
        // Check if the text content matches the regex pattern
        const matches = text.match(accountId);
        if (matches) {
          // Create a span element to replace the current text element, so we can set HTML inside it.
          const replacementElement = document.createElement("span");
          replacementElement.setAttribute("data-tampered", "true");
          replacementElement.innerHTML = text.replace(
            accountId,
            (match) => `<span style="background-color:${backgroundColor || DEFAULT_BACKGROUND_COLOR};color:${textColor || DEFAULT_TEXT_COLOR};padding-left:0.25em;padding-right:0.25em;border-radius:0.25em"><dfn title="${accountName}">${match}</dfn></span>`
          );
          // Replace text node with span node
          element.parentNode.replaceChild(replacementElement, element);
        }
      }
    } else {
      element.childNodes.forEach((child) => highlightText(child));
    }
  }

  // Start the recursion from the body element
  highlightText(document.body);
})();
