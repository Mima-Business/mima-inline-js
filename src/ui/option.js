import { ce, append } from "../core/utils.js";
import { openCheckout } from "../core/checkout.js";

export function renderOption({
  selector,
  title = "Pay with Mima",
  logoSrc,
  className = "",
  ...checkoutProps
}) {
  const host =
    typeof selector === "string" ? document.querySelector(selector) : selector;
  if (!host) throw new Error("PayWithMima: host element not found");
  host.classList.add("mima-option");
  if (className) host.classList.add(...className.split(" "));

  const label = ce("label", "mima-option-label");
  const radio = ce("input");
  radio.type = "radio";
  radio.name = checkoutProps?.groupName || "mima-pay-option";
  const span = ce("span", "mima-option-text");
  span.textContent = title;
  const img = ce("img", "mima-option-logo");
  if (logoSrc) img.src = logoSrc;
  img.alt = "Mima Logo";

  const payWrap = ce("div", "mima-paywrap");
  const btn = ce("button", "mima-btn");
  btn.type = "button";
  btn.textContent = "Pay now";
  btn.style.display = "none";

  radio.addEventListener("change", () => {
    btn.style.display = radio.checked ? "block" : "none";
  });
  btn.addEventListener("click", () => openCheckout(checkoutProps));

  append(label, radio, span);
  append(host, label, img, payWrap);
  append(payWrap, btn);
}
