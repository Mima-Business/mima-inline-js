import { openCheckout } from "./core/checkout.js";
import { renderButton } from "./ui/button.js";
import { injectStyles } from "./ui/injectStyles.js";
import { renderOption } from "./ui/option.js";

function ensureOpts(opts) {
  if (!opts || !opts.payload || !opts.signature) {
    throw new Error("MimaCheckout: `payload` and `signature` are required.");
  }
  return opts;
}

export const MimaCheckout = {
  open: (opts) => {
    injectStyles();
    return openCheckout(ensureOpts(opts));
  },
  renderButton: (opts) => {
    injectStyles();
    return renderButton(ensureOpts(opts));
  },
  renderOption: (opts) => {
    injectStyles();
    return renderOption(ensureOpts(opts));
  },
};

// UMD-style global attach
if (typeof window !== "undefined") {
  window.MimaCheckout = MimaCheckout;
}

export default MimaCheckout;
