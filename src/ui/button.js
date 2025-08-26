import { ce } from "../core/utils.js";
import { openCheckout } from "../core/checkout.js";
import { openSubscribe } from "../core/subscribe.js";

export function renderButton({
  selector,
  title = "Pay with Mima",
  className = "",
  ...checkoutProps
}) {
  const host =
    typeof selector === "string" ? document.querySelector(selector) : selector;
  if (!host) throw new Error("MimaButton: host element not found");
  host.classList.add("mima-btn");
  if (className) host.classList.add(...className.split(" "));
  host.textContent = title;
  host.addEventListener("click", () => openCheckout(checkoutProps));
}

export function renderSubButton({
  selector,
  title = "Pay now",
  className = "",
  ...subscribeProps
}) {
  const host =
    typeof selector === "string" ? document.querySelector(selector) : selector;
  if (!host) throw new Error("MimaButton: host element not found");
  host.classList.add("mima-btn");
  if (className) host.classList.add(...className.split(" "));
  host.textContent = title;
  host.addEventListener("click", () => openSubscribe(subscribeProps));
}
