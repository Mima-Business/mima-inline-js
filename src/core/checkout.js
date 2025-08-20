import { createModal, setBodyContent } from "../ui/modal.js";
import { spinner } from "../ui/spinner.js";
import { createInvoiceSession } from "./api.js";
import { ce } from "./utils.js";
import { mountStripe } from "./stripe.js";
import { startPaystack } from "./paystack.js";
import {
  BASE_API_URL,
  PAYSTACK_PUBLIC_KEY,
  STRIPE_PUBLIC_KEY,
  TEST_BASE_API_URL,
  TEST_PAYSTACK_PUBLIC_KEY,
  TEST_STRIPE_PUBLIC_KEY,
} from "../config.js";

export async function openCheckout(opts) {
  const { payload, signature, testMode = false, onSuccess, onClose } = opts;

  const baseUrl = BASE_API_URL;
  const testBaseUrl = TEST_BASE_API_URL;
  const stripePublicKey = STRIPE_PUBLIC_KEY;
  const testStripePublicKey = TEST_STRIPE_PUBLIC_KEY;
  const paystackPublicKey = PAYSTACK_PUBLIC_KEY;
  const testPaystackPublicKey = TEST_PAYSTACK_PUBLIC_KEY;
  const urls = {
    product: "/invoices/new/checkout",
    bookings: "/invoices/accept-booking-invoice",
  };

  const chosenBase = testMode ? testBaseUrl || baseUrl : baseUrl;
  console.log("chosenBase", chosenBase);
  console.log("payload", payload);

  if (!chosenBase)
    throw new Error(
      "MimaCheckout: `baseUrl` (and optionally `testBaseUrl`) is required."
    );
  const currencyCode = payload?.order?.currencyCode;
  const modal = createModal({ onClose });

  // Loading state
  const loadNode = ce("div", "mima-center");
  loadNode.appendChild(spinner(56));
  setBodyContent(modal, loadNode);

  let invoice;
  try {
    invoice = await createInvoiceSession({
      baseUrl: chosenBase,
      path: urls.product,
      payload,
      signature,
    });
  } catch (e) {
    modal.open();
    const err = ce("div", "mima-error");
    err.textContent = e.message;
    setBodyContent(modal, err);
    return;
  }

  if (invoice?.currencyCode === "NGN") {
    const pk = testMode
      ? testPaystackPublicKey || paystackPublicKey
      : paystackPublicKey;

    if (!pk) {
      setBodyContent(modal, errorNode("Paystack key missing."));
      return;
    }
    try {
      await startPaystack({
        publicKey: pk,
        email: invoice?.customer?.email,
        amount: invoice?.transactionAmount,
        metadata: {
          custom_fields: [
            {
              display_name: "business",
              variable_name: "business",
              value: invoice?.business?._id,
            },
            {
              display_name: "invoiceNumber",
              variable_name: "invoiceNumber",
              value: `INV-${invoice?.number}`,
            },
            {
              display_name: "customerName",
              variable_name: "customerName",
              value: invoice?.customer?.fullname,
            },
            {
              display_name: "invoice",
              variable_name: "invoice",
              value: invoice?._id,
            },
            { display_name: "type", variable_name: "type", value: "INVOICE" },
          ],
        },
        onSuccess: () => {
          onSuccess && onSuccess();
          modal.close();
        },
        onClose: () => {
          onClose && onClose();
          modal.close();
        },
      });
    } catch (e) {
      setBodyContent(modal, errorNode(e.message));
    }
    return;
  }

  // Stripe flow
  modal.open();

  const stripeKey = testMode
    ? testStripePublicKey || stripePublicKey
    : stripePublicKey;
  if (!stripeKey) {
    setBodyContent(modal, errorNode("Stripe key missing."));
    return;
  }
  if (!invoice?.stripeSessionId) {
    setBodyContent(modal, errorNode("Stripe client secret missing."));
    return;
  }

  // Build UI
  const wrap = ce("div", "mima-stripe-wrap");

  // Top info (amount + note)
  const top = ce("div", "mima-top");
  const topP = ce("p");
  topP.style.color = "#464646";
  const amtSpan = ce("span", "mima-top-span");
  amtSpan.textContent = `${invoice.currencyCode} ${invoice.transactionAmount}`;
  topP.textContent = "Pay ";
  topP.appendChild(amtSpan);

  const note = ce("p", "mima-top-first");
  note.textContent = "All transactions are secure and encrypted.";

  top.appendChild(topP);
  top.appendChild(note);
  wrap.appendChild(top);

  // PaymentElement mount area
  const mountPoint = ce("div", "mima-stripe-mount");
  wrap.appendChild(mountPoint);

  // Actions (Go Back | Pay now)
  const actions = ce("div", "mima-stripe-actions");
  const backBtn = ce("button", "mima-btn outlined full");
  backBtn.type = "button";
  backBtn.textContent = "Go Back";
  backBtn.addEventListener("click", () => {
    modal.close(); // mirrors goBack in React
    onClose && onClose();
  });

  const payBtn = ce("button", "mima-btn full");
  payBtn.type = "button";
  payBtn.textContent = "Pay now";
  actions.appendChild(backBtn);
  actions.appendChild(payBtn);
  wrap.appendChild(actions);

  // Powered by (with optional logo)
  const powered = ce("a", "mima-powered");
  powered.href = "https://mimapay.africa/";
  powered.target = "_blank";
  powered.rel = "noopener noreferrer";

  const poweredText = ce("span");
  poweredText.textContent = "Powered by";
  powered.appendChild(poweredText);

  // If you have a logo URL available, append it. (See note below)
  if (window.MIMA_LOGO_URL) {
    const img = ce("img", "mima-powered-logo");
    img.src = window.MIMA_LOGO_URL;
    img.alt = "Mima Logo";
    powered.appendChild(img);
  }

  wrap.appendChild(powered);

  setBodyContent(modal, wrap);

  // Mount Stripe + wire the Pay button
  try {
    await mountStripe({
      clientSecret: invoice.stripeSessionId,
      publishableKey: stripeKey,
      container: mountPoint,
      currencyCode: invoice.currencyCode,
      amount: invoice.transactionAmount,
      // ✨ NEW: hand the pay button to Stripe mount so it binds confirmPayment
      payButtonEl: payBtn,
      // Optional: where to return if 3DS redirect happens
      returnUrl:
        payload?.callBackUrl && payload.callBackUrl.startsWith("http")
          ? payload.callBackUrl
          : window.location.href,
      onSuccess: () => {
        onSuccess && onSuccess();
        modal.close();
      },
      onClose: () => modal.close(),
    });
  } catch (e) {
    setBodyContent(modal, errorNode(e.message));
  }
}

function errorNode(message) {
  const n = ce("div", "mima-error");
  n.textContent = message || "An error occurred.";
  return n;
}
