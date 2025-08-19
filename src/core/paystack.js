import { loadScript } from "./utils.js";
const PAYSTACK_JS = "https://js.paystack.co/v1/inline.js";

export async function startPaystack({
  publicKey,
  email,
  amount,
  metadata,
  onSuccess,
  onClose,
}) {
  await loadScript(PAYSTACK_JS);
  if (!window.PaystackPop) throw new Error("Paystack failed to load");
  const handler = window.PaystackPop.setup({
    key: publicKey,
    email,
    amount: Math.round(amount * 100),
    metadata,
    callback: function () {
      onSuccess && onSuccess();
    },
    onClose: function () {
      onClose && onClose();
    },
  });
  handler.openIframe();
}
