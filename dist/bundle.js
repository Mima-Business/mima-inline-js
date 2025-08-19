(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.MimaCheckout = {}));
})(this, (function (exports) { 'use strict';

  function qsa(sel, root = document) {
    return Array.from(root.querySelectorAll(sel));
  }
  function ce(tag, cls) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    return el;
  }
  function append(parent, ...children) {
    children.forEach((c) => c && parent.appendChild(c));
    return parent;
  }
  function remove(el) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }
  function text(tag, txt, cls) {
    const el = ce(tag, cls);
    el.textContent = txt;
    return el;
  }
  function loadScript(src) {
    return new Promise((res, rej) => {
      if (qsa(`script[src="${src}"]`).length) return res();
      const s = ce("script");
      s.src = src;
      s.async = true;
      s.onload = () => res();
      s.onerror = () => rej(new Error(`Failed to load ${src}`));
      document.head.appendChild(s);
    });
  }
  function lockScroll(lock = true) {
    const cls = "mima-scroll-lock";
    if (lock) document.documentElement.classList.add(cls);
    else document.documentElement.classList.remove(cls);
  }

  function createModal({ onClose }) {
    const overlay = ce("div", "mima-overlay");
    const modal = ce("div", "mima-modal");
    const closeBtn = ce("button", "mima-close");
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.innerHTML = "&times;";
    const head = ce("div", "mima-head");
    append(head, text("div", "Checkout", "mima-title"), closeBtn);
    const body = ce("div", "mima-body");
    const foot = ce("div", "mima-foot");
    append(modal, head, body, foot);
    const host = ce("div", "mima-host");
    append(host, overlay, modal);

    function open() {
      document.body.appendChild(host);
      lockScroll(true);
    }
    function close() {
      lockScroll(false);
      remove(host);
      onClose && onClose();
    }

    overlay.addEventListener("click", close);
    closeBtn.addEventListener("click", close);

    return { host, overlay, modal, head, body, foot, open, close };
  }

  function setBodyContent(modal, node) {
    const body = modal.body;
    body.innerHTML = "";
    if (node) body.appendChild(node);
  }

  function spinner(size = 48) {
    const s = ce("div", "mima-spinner");
    s.style.width = `${size}px`;
    s.style.height = `${size}px`;
    return s;
  }

  async function createInvoiceSession({
    baseUrl,
    path,
    payload,
    signature,
  }) {
    const url = `${baseUrl}${path}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-mima-signature": signature,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || data?.error) {
      const msg = data?.message || "Something went wrong. Please try again.";
      throw new Error(msg);
    }
    return data; // Expecting shape of InvoiceResponse from your backend
  }

  const STRIPE_JS = "https://js.stripe.com/v3";

  async function mountStripe({
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

  const PAYSTACK_JS = "https://js.paystack.co/v1/inline.js";

  async function startPaystack({
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

  const STRIPE_PUBLIC_KEY = undefined;
  const PAYSTACK_PUBLIC_KEY = undefined;
  const BASE_API_URL = undefined;

  async function openCheckout(opts) {
    const { payload, signature, testMode = false, onSuccess, onClose } = opts;

    const baseUrl = BASE_API_URL;
    const stripePublicKey = STRIPE_PUBLIC_KEY;
    const paystackPublicKey = PAYSTACK_PUBLIC_KEY;
    const urls = {
      product: "/invoices/new/checkout",
      bookings: "/invoices/accept-booking-invoice",
    };

    console.log("baseUrl", baseUrl);

    const chosenBase = testMode ? baseUrl : baseUrl;
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
        ? paystackPublicKey
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
      ? stripePublicKey
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

  function renderButton({
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

  function renderOption({
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

  function ensureOpts(opts) {
    if (!opts || !opts.payload || !opts.signature) {
      throw new Error("MimaCheckout: `payload` and `signature` are required.");
    }
    return opts;
  }

  const MimaCheckout = {
    open: (opts) => openCheckout(ensureOpts(opts)),
    renderButton: (opts) => renderButton(ensureOpts(opts)),
    renderOption: (opts) => renderOption(ensureOpts(opts)),
  };

  // UMD-style global attach
  if (typeof window !== "undefined") {
    window.MimaCheckout = MimaCheckout;
  }

  exports.MimaCheckout = MimaCheckout;
  exports["default"] = MimaCheckout;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
