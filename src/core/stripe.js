import { loadScript, ce, append, text } from "./utils.js";
const STRIPE_JS = "https://js.stripe.com/v3";

export async function mountStripe({
  clientSecret,
  publishableKey,
  container,
  currencyCode,
  amount,
  onSuccess,
  onClose,
}) {
  await loadScript(STRIPE_JS);
  if (!window.Stripe) throw new Error("Stripe.js failed to load");
  const stripe = window.Stripe(publishableKey);
  const elements = stripe.elements({
    clientSecret,
    appearance: { theme: "stripe" },
  });
  const paymentEl = elements.create("payment");
  paymentEl.mount(container);

  const payBtn = ce("button", "mima-btn");
  payBtn.type = "button";
  payBtn.textContent = `Pay ${formatAmount(amount, currencyCode)}`;
  const err = ce("div", "mima-error");
  append(container.parentNode, payBtn, err);

  payBtn.addEventListener("click", async () => {
    payBtn.disabled = true;
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {},
    });
    payBtn.disabled = false;
    if (error) {
      err.textContent = error.message || "Payment failed.";
      return;
    }
    onSuccess && onSuccess();
    onClose && onClose();
  });
}

function formatAmount(amount, currency) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return amount;
  }
}
