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

  console.log("baseUrl", baseUrl);

  const chosenBase = testMode ? testBaseUrl || baseUrl : baseUrl;
  if (!chosenBase)
    throw new Error(
      "MimaCheckout: `baseUrl` (and optionally `testBaseUrl`) is required."
    );

  const modal = createModal({ onClose });
  modal.open();

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

  // Mount PaymentElement + Pay button
  const wrap = ce("div", "mima-stripe-wrap");
  const mountPoint = ce("div", "mima-stripe-mount");
  wrap.appendChild(mountPoint);
  setBodyContent(modal, wrap);

  try {
    await mountStripe({
      clientSecret: invoice.stripeSessionId,
      publishableKey: stripeKey,
      container: mountPoint,
      currencyCode: invoice.currencyCode,
      amount: invoice.transactionAmount,
      onSuccess: () => onSuccess && onSuccess(),
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
