// src/injectStyles.js
let injected = false;

export function injectStyles() {
  if (injected) return;
  injected = true;

  const css = `
* {
  line-height: 1.2;
}
h1,h2,h3,h4,h5,h6,p {
  all: unset;
  line-height: 1.4;
  display: block;
}
h1,h2,h3,h4,h5,h6 { font-weight: 600; }

:root {
  --primary-normal: #1f68d6;
  --primary-hover: #003c97;
  --grey-200: #e5e7eb;
  --dark-700: #414651;
  --dark-900: #1f2937;
}

/* Overlay & Modal */
.mima-scroll-lock { overflow: hidden; }
.mima-overlay,
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.4);
  z-index: 9998;
}
.mima-modal,
.modalContent {
  position: fixed;
  top:50%; left:50%;
  transform: translate(-50%,-50%);
  background:#fff;
  width:min(520px,92vw);
  max-height:85vh;
  overflow:auto;
  border-radius:12px;
  box-shadow:0 10px 30px rgba(0,0,0,0.2);
  z-index:9999;
  animation: modalFadeIn .25s ease-out;
  padding: 20px;
}
@keyframes modalFadeIn {
  0% { opacity:0; transform:scale(.96); }
  100% { opacity:1; transform:scale(1); }
}

/* Header */
.mima-head { display:flex; align-items:center; justify-content:space-between; padding:14px 16px; border-bottom:1px solid #eee; }
.mima-title { font-weight:600; font-size:16px; }
.mima-close { background:transparent; border:none; font-size:24px; cursor:pointer; }

/* Body + Footer */
.mima-body { padding:16px; }
.mima-foot { padding:12px 16px 16px; }

/* Buttons */
.buttonBase,
.mima-btn {
  height:40px;
  padding:8px 12px;
  border-radius:6px;
  cursor:pointer;
  width:fit-content;
  display:flex;
  justify-content:center;
  align-items:center;
  gap:8px;
  white-space:nowrap;
  outline:none;
  border:none;
  font-weight:600;
  transition: background-color .2s ease;
}
.buttonBase:disabled,
.mima-btn:disabled,
.mima-btn.disabled {
  background-color:#ccc;
  cursor:not-allowed;
}
.buttonDefault,
.mima-btn {
  background-color:var(--primary-normal);
  color:#fff;
}
.buttonDefault:hover,
.mima-btn:hover { background-color:var(--primary-hover); }
.buttonOutlined,
.mima-btn.outlined {
  background:transparent;
  border:1px solid var(--grey-200);
  color:var(--dark-700);
}
.buttonOutlined:hover,
.mima-btn.outlined:hover {
  border-color:var(--dark-700);
  color:var(--dark-900);
  background-color:var(--grey-200);
}
.buttonText,
.mima-btn.text {
  background:transparent;
  color:var(--primary-normal);
}
.buttonText:hover,
.mima-btn.text:hover { color:var(--primary-hover); }
.buttonFull,
.mima-btn.full { width:100%; }
.buttonDisabled { opacity:.6; pointer-events:none; }

/* Error + Loading */
.errorMessage,
.mima-error {
  background:#fff;
  color:#d32f2f;
  font-weight:500;
  padding:20px;
  border-radius:10px;
  border:1px solid #d32f2f;
  text-align:center;
}
.loading,
.mima-center {
  display:flex;
  align-items:center;
  justify-content:center;
  background:#fff;
  padding:20px;
  border-radius:10px;
  box-shadow:0 2px 8px rgba(0,0,0,.2);
}

/* Spinner */
.spinner,
.mima-spinner {
  border:2px solid rgba(0,0,0,.1);
  border-top:2px solid var(--primary-normal);
  border-radius:50%;
  width:20px;
  height:20px;
  animation: spin .6s linear infinite;
}
@keyframes spin { to { transform:rotate(360deg); } }

/* Options & Stripe */
.mima-option { display:flex; align-items:center; gap:12px; border:1px solid #eee; padding:12px; border-radius:12px; }
.mima-option-logo,
.logo { height:24px; object-fit:contain; display:block; }
.mima-option-label,
.label { display:flex; align-items:center; gap:8px; cursor:pointer; }
.labelText { font-weight:500; }

.mima-stripe-wrap { display:flex; flex-direction:column; gap:12px; }
.mima-stripe-mount { padding:8px; border:1px solid #eee; border-radius:12px; }
.mima-stripe-actions { display:grid; grid-template-columns:150px 1fr; gap:1rem; width:100%; margin-top:12px; }

/* Top Section */
.mima-top,
.checkoutTop { margin-bottom:8px; display:flex; flex-direction:column; font-size:20px; }
.mima-top-span,
.checkoutTopSpan { font-weight:600; color:#136e13; }
.mima-top-first,
.checkoutTopFirst { color:#6b7280; font-size:14px; margin-top:4px; }

/* Powered by */
.mima-powered,
.mima {display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  gap: 10px;
  text-decoration: none;
  color: var(--dark-900); }
.mima-powered-logo,
.logo { height: 25px;
  width: auto;
  object-fit: contain;
  display: block; }
`;

  const styleEl = document.createElement("style");
  styleEl.textContent = css;
  document.head.appendChild(styleEl);
}
