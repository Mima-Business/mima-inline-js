import { ce, append, remove, text, qs, lockScroll } from "../core/utils.js";

export function createModal({ onClose }) {
  const overlay = ce("div", "mima-overlay");
  const modal = ce("div", "mima-modal");
  const closeBtn = ce("button", "mima-close");
  closeBtn.setAttribute("aria-label", "Close");
  closeBtn.innerHTML = "&times;";
  const head = ce("div", "mima-head");
  append(head, text("div", "Checkout", "mima-title"), closeBtn);
  const body = ce("div", "mima-body");
  const foot = ce("div", "mima-foot");
  append(modal, head, body, foot);
  const host = ce("div", "mima-host");
  append(host, overlay, modal);

  function open() {
    document.body.appendChild(host);
    lockScroll(true);
  }
  function close() {
    lockScroll(false);
    remove(host);
    onClose && onClose();
  }

  overlay.addEventListener("click", close);
  closeBtn.addEventListener("click", close);

  return { host, overlay, modal, head, body, foot, open, close };
}

export function setBodyContent(modal, node) {
  const body = modal.body;
  body.innerHTML = "";
  if (node) body.appendChild(node);
}
