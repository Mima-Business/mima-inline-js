import {
  BASE_API_URL,
  logoUrl,
  PAYSTACK_PUBLIC_KEY,
  STRIPE_PUBLIC_KEY,
  TEST_BASE_API_URL,
  TEST_PAYSTACK_PUBLIC_KEY,
  TEST_STRIPE_PUBLIC_KEY,
} from "../config.js";
import { startPaystack } from "./paystack.js";
import { createModal, setBodyContent } from "../ui/modal.js";
import { spinner } from "../ui/spinner.js";
import { createCustomerSession, saveCardSession } from "./api.js";
import { ce } from "./utils.js";
import { createSubscription } from "./createSubscription.js";

export async function openSubscribe(opts) {
  const { payload, signature, testMode = false, onSuccess, onClose } = opts;

  if (!payload.currencyCode || !payload.amount) {
    throw new Error(
      "MimaSubscribe: `currencyCode` and `amount` are required in payload."
    );
  }
  const currencyCode = payload?.currencyCode;

  const baseUrl = BASE_API_URL;
  const testBaseUrl = TEST_BASE_API_URL;
  const stripePublicKey = STRIPE_PUBLIC_KEY;
  const testStripePublicKey = TEST_STRIPE_PUBLIC_KEY;
  const paystackPublicKey = PAYSTACK_PUBLIC_KEY;
  const testPaystackPublicKey = TEST_PAYSTACK_PUBLIC_KEY;
  const urls = {
    subscribe: "/business-subscription/subscribe",
    createCustomer: "/customers/external-customer",
    saveCard: "/customers/add-customer-card",
  };

  const chosenBase = testMode ? testBaseUrl || baseUrl : baseUrl;

  if (!chosenBase)
    throw new Error(
      "MimaSubscribe: `baseUrl` (and optionally `testBaseUrl`) is required."
    );

  const modal = createModal({ onClose });
  modal.open();

  // Loading state
  const loadNode = ce("div", "mima-center");
  loadNode.appendChild(spinner(75));
  setBodyContent(modal, loadNode);

  let customer;

  const customerPayload = {
    publicKey: payload?.publicKey,
    ...payload?.customer,
  };

  try {
    customer = await createCustomerSession({
      baseUrl: chosenBase,
      path: urls.createCustomer,
      payload: customerPayload,
    });
  } catch (e) {
    modal.open();
    const err = ce("div", "mima-error");
    err.textContent = e.message;
    setBodyContent(modal, err);
    return;
  }

  if (customer?.customer?.fullname && currencyCode === "NGN") {
    const pk = testMode
      ? testPaystackPublicKey || paystackPublicKey
      : paystackPublicKey;

    if (!pk) {
      setBodyContent(modal, errorNode("Paystack key missing."));
      return;
    }

    modal.close();

    let saveCard;

    try {
      await startPaystack({
        publicKey: pk,
        channels: ["card"],
        email: payload?.customer?.email,
        amount: payload?.amount,
        metadata: {
          custom_fields: [
            // {
            //   display_name: "business",
            //   variable_name: "business",
            //   value: subscription?.business?._id,
            // },
            // {
            //   display_name: "planName",
            //   variable_name: "planName",
            //   value: subscription?.plan?.name,
            // },
            // {
            //   display_name: "customerName",
            //   variable_name: "customerName",
            //   value: subscription?.customer?.fullname,
            // },
            // {
            //   display_name: "plan",
            //   variable_name: "plan",
            //   value: invoice?.plan?._id,
            // },
            {
              display_name: "type",
              variable_name: "type",
              value: "SUBSCRIPTION",
            },
          ],
        },
        onSuccess: async (reference) => {
          try {
            saveCard = await saveCardSession({
              baseUrl: chosenBase,
              path: urls.saveCard,
              payload: {
                email: payload?.customer?.email,
                reference: reference,
              },
            });

            if (saveCard?.card) {
              await createSubscription({
                baseUrl: chosenBase,
                path: urls.subscribe,
                payload: {
                  plan: payload?.plan,
                  customer: payload?.customer,
                  publicKey: payload?.publicKey,
                },
                onClose: onClose,
                onSuccess: onSuccess,
              });
            }
          } catch (e) {
            modal.open();
            const err = ce("div", "mima-error");
            err.textContent = e.message;
            setBodyContent(modal, err);
            return;
          }
          modal.close();
        },
        onClose: () => {
          if (!saveCard?.card) {
            onClose && onClose();
          }
          modal.close();
        },
      });
    } catch (e) {
      modal.open();
      setBodyContent(modal, errorNode(e.message));
    }
    return;
  }
}
