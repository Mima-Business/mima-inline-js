import { loadScript, ce } from "./utils.js";
const STRIPE_JS = "https://js.stripe.com/v3";

export async function mountStripe({
  clientSecret,
  publishableKey,
  container,
  currencyCode,
  amount,
  payButtonEl,
  returnUrl,
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

  // Mount PaymentElement only
  const paymentEl = elements.create("payment");
  paymentEl.mount(container);

  // Decide which Pay button to use
  const payBtn =
    payButtonEl ||
    (() => {
      const b = ce("button", "mima-btn");
      b.type = "button";
      b.textContent = `Pay ${formatAmount(amount, currencyCode)}`;
      container.parentNode.appendChild(b);
      return b;
    })();

  const err = ce("div", "mima-error");

  payBtn.addEventListener("click", async () => {
    payBtn.disabled = true;
    err.textContent = "";

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: returnUrl ? { return_url: returnUrl } : {},
      redirect: "if_required",
    });

    payBtn.disabled = false;

    if (error) {
      container.parentNode.appendChild(err);
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
