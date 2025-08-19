export function qs(sel, root = document) {
  return root.querySelector(sel);
}
export function qsa(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}
export function ce(tag, cls) {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  return el;
}
export function append(parent, ...children) {
  children.forEach((c) => c && parent.appendChild(c));
  return parent;
}
export function remove(el) {
  if (el && el.parentNode) el.parentNode.removeChild(el);
}
export function text(tag, txt, cls) {
  const el = ce(tag, cls);
  el.textContent = txt;
  return el;
}
export function loadScript(src) {
  return new Promise((res, rej) => {
    if (qsa(`script[src="${src}"]`).length) return res();
    const s = ce("script");
    s.src = src;
    s.async = true;
    s.onload = () => res();
    s.onerror = () => rej(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}
export function lockScroll(lock = true) {
  const cls = "mima-scroll-lock";
  if (lock) document.documentElement.classList.add(cls);
  else document.documentElement.classList.remove(cls);
}
