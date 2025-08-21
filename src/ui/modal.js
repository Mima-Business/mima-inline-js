import { ce, append, remove, lockScroll } from "../core/utils.js";

export function createModal({ onClose }) {
  const host = ce("div", "checkoutModal"); // same as React root
  const backdrop = ce("div", "backdrop");
  const modalContent = ce("div", "modalContent");

  append(host, backdrop, modalContent);

  function open() {
    document.body.appendChild(host);
    lockScroll(true);
  }

  function close() {
    lockScroll(false);
    remove(host);
    onClose && onClose();
  }

  backdrop.addEventListener("click", close);

  return { host, backdrop, modalContent, open, close };
}

export function setBodyContent(modal, node) {
  modal.modalContent.innerHTML = "";
  if (node) modal.modalContent.appendChild(node);
}
