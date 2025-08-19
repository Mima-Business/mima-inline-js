import { ce } from "../core/utils.js";
export function spinner(size = 48) {
  const s = ce("div", "mima-spinner");
  s.style.width = `${size}px`;
  s.style.height = `${size}px`;
  return s;
}
