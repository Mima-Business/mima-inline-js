<p align="center">
  <img src="./src/assets/img/mima-logo.png" alt="Mimapay Africa" width="200"/>
</p>

# Mima Inline JS

---

## Introduction

**Mima Inline JS** is a lightweight JavaScript SDK that enables businesses to seamlessly collect payments for **goods and services** directly on their websites. Payments go straight into their **Mima Wallet** and can be received in **Naira (NGN)** or any of **135+ international currencies** like **USD, GBP, EUR**, and more.

This SDK works with any frontend framework (React, Vue, Angular) or plain HTML/JavaScript, providing both an inline payment UI and a programmatic API to easily initiate and manage payments.

---

## 🌍 Features

- Accept payments in NGN and 135+ global currencies.
- Drop-in UI components for a seamless checkout experience.
- No external provider configuration required.
- Works with JavaScript and TypeScript out of the box.
- Framework-agnostic — usable in React, Vue, or plain JS

---

## Table of Contents

1. [Requirements](#requirements)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Checkout Parameters](#checkout-parameters)
5. [Subscription Parameters](#subscription-parameters)
6. [Support](#support)
7. [Contribution Guidelines](#contribution-guidelines)
8. [License](#license)
9. [Contributors](#contributors)
10. [Changelog](#)

---

## Requirements

1. **Mima Public API keys**
2. **Node.js ≥ 16.0.0** (recommended)
3. **npm ≥ 7.x** or **yarn ≥ 1.22.x** (recommended)
4. Works in:
   - **Vanilla JS** via `<script>` import
   - **React ≥ 18.x** (and upcoming 19.x)
   - **Vue ≥ 3.x**

## Installation

### Using CDN (Vanilla JS)

Add the script tag to your HTML:

```bash
<script src="https://js.mimapay.africa/v1/inline.js"></script>
```

### Using npm or yarn

```bash
npm install mima-inline-js
# or
yarn add mima-inline-js
```

## Usage

Add Mima pay to your projects as a component or function:

1. [As a function ](#function)
2. [As a component with selection UI](#components)
3. [As a pre-styled button](#button)
4. [For recurring payments or subscriptions](#subscriptions)

### Function

Use this method in your html and also ensure the mima inline script tag has been added.

#### Sample for Vanilla JS

```html
<button id="pay-btn" style="margin-top: 20px">Pay Now</button>

<script>
  const customer = {
    fullname: "John Doe",
    email: "john@example.com",
    mobile: "08012345678",
    street: "123 Street",
    country: "Nigeria",
    postCode: "100001",
    state: "Lagos",
  };

  const items = [
    {
      item: "T-shirt",
      unitPrice: 10000,
      quantity: 3,
    },
  ];

  const payload = {
    customer,
    publicKey: "fd86a********************4",
    order: {
      items,
      currencyCode: "NGN",
      shipping: 200,
      orderId: "ORDER123456",
    },
  };

  function checkout() {
    MimaCheckout.open({
      payload,
      signature: "2341abc********************4",
      onSuccess: () => alert("Payment Successful"),
      onClose: () => console.log("Closed"),
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("pay-btn");
    if (btn) {
      btn.addEventListener("click", checkout);
    }
  });
</script>
```

#### Sample for React JS

```javascript
import React from "react";
import { MimaCheckout } from "mima-inline-js";

export default function App() {
  const customer = {
    fullname: "John Doe",
    email: "john@example.com",
    mobile: "08012345678",
    street: "123 Street",
    country: "Nigeria",
    postCode: "100001",
    state: "Lagos",
  };

  const items = [
    {
      item: "T-shirt",
      unitPrice: 2000,
      quantity: 2,
    },
  ];

  const payload = {
    customer,
    publicKey: "fd86a********************4",
    order: {
      items,
      currencyCode: "NGN",
      shipping: 200,
      orderId: "ORDER123456",
    },
  };

  const mimaConfig = {
    payload,
    signature: "2341abc********************4",
    onSuccess: () => alert("Payment Successful"),
    onClose: () => console.log("Closed"),
  };

  return (
    <div className="App">
      <h1>Hello Test user</h1>
      <button
        onClick={() => {
          MimaCheckout.open(mimaConfig);
        }}
      >
        Pay Now
      </button>
    </div>
  );
}
```

### Components

Ensure to include an empty div with a **unique id** where the ui will render. Also add the **selector** prop staring with **#** followed by the **unique id** to ensure the user can select mima the preferred payment option

#### Sample for Vanilla Js

```html
<div id="mima-option" style="margin-top: 20px; width: fit-content"></div>

<script>
  const customer = {
    fullname: "John Doe",
    email: "john@example.com",
    mobile: "08012345678",
    street: "123 Street",
    country: "Nigeria",
    postCode: "100001",
    state: "Lagos",
  };

  const items = [
    {
      item: "T-shirt",
      unitPrice: 10000,
      quantity: 3,
    },
  ];

  const payload = {
    customer,
    publicKey: "fd86a********************4",
    order: {
      items,
      currencyCode: "NGN",
      shipping: 200,
      orderId: "ORDER123456",
    },
  };

  const option = MimaCheckout.renderOption({
    selector: "#mima-option",
    payload,
    signature: signature(),
    onSuccess: () => alert("Payment Successful"),
    onClose: () => console.log("Closed"),
  });
</script>
```

#### Sample for React JS

```javascript
import React, { useState } from "react";
import { MimaCheckout } from "mima-inline-js";

export default function App() {
  const customer = {
    fullname: "John Doe",
    email: "john@example.com",
    mobile: "08012345678",
    street: "123 Street",
    country: "Nigeria",
    postCode: "100001",
    state: "Lagos",
  };

  const items = [
    {
      item: "T-shirt",
      unitPrice: 2000,
      quantity: 2,
    },
  ];

  const payload = {
    customer,
    publicKey: "fd86a********************4",
    order: {
      items,
      currencyCode: "NGN",
      shipping: 200,
      orderId: "ORDER123456",
    },
  };

  const mimaConfig = {
    payload,
    onSelect: () => setMethod("mima"),
    onSuccess: () => alert("Payment Successful"),
    onClose: () => console.log("Closed"),
    signature: "2341abc********************4",
  };

  const optionRef = useRef(null);

  useEffect(() => {
    if (optionRef.current && window.MimaCheckout) {
      window.MimaCheckout.renderOption({
        selector: `#${optionRef.current.id}`,
        ...mimaConfig,
      });
    }
  }, []);

  return (
    <div className="App">
      <h1>Hello Test user</h1>
      <div id="mima-option" ref={optionRef}></div>
    </div>
  );
}
```

### Button

Ensure to include an empty div with a **unique id** where the ui will render. Also add the **selector** prop staring with **#** followed by the **unique id** to ensure the user can select mima the preferred payment option

#### Sample for Vanilla Js

```html
<div id="mima-btn"></div>

<script>
  const customer = {
    fullname: "John Doe",
    email: "john@example.com",
    mobile: "08012345678",
    street: "123 Street",
    country: "Nigeria",
    postCode: "100001",
    state: "Lagos",
  };

  const items = [
    {
      item: "T-shirt",
      unitPrice: 10000,
      quantity: 3,
    },
  ];

  const payload = {
    customer,
    publicKey: "fd86a********************4",
    order: {
      items,
      currencyCode: "NGN",
      shipping: 200,
      orderId: "ORDER123456",
    },
  };

  const checkout = MimaCheckout.renderButton({
    selector: "#mima-btn",
    payload,
    signature: signature(),
    onSuccess: () => alert("Payment Successful"),
    onClose: () => console.log("Closed"),
    title: "Rename Button",
  });
</script>
```

#### Sample for React JS

```javascript
import React, { useState } from "react";
import { MimaCheckout } from "mima-inline-js";

export default function App() {
  const customer = {
    fullname: "John Doe",
    email: "john@example.com",
    mobile: "08012345678",
    street: "123 Street",
    country: "Nigeria",
    postCode: "100001",
    state: "Lagos",
  };

  const items = [
    {
      item: "T-shirt",
      unitPrice: 2000,
      quantity: 2,
    },
  ];

  const payload = {
    customer,
    publicKey: "fd86a********************4",
    order: {
      items,
      currencyCode: "NGN",
      shipping: 200,
      orderId: "ORDER123456",
    },
  };

  const mimaConfig = {
    payload,
    onSelect: () => setMethod("mima"),
    onSuccess: () => alert("Payment Successful"),
    onClose: () => console.log("Closed"),
    signature: "2341abc********************4",
  };

  const btnRef = useRef(null);

  useEffect(() => {
    if (btnRef.current && window.MimaCheckout) {
      window.MimaCheckout.renderButton({
        selector: `#${btnRef.current.id}`,
        ...mimaButtonConfig,
      });
    }
  }, []);

  return (
    <div className="App">
      <h1>Hello Test user</h1>
      <div id="mima-btn" ref={btnRef}></div>
    </div>
  );
}
```

## Checkout Parameters

Read about our checkout parameters and how they can be used

| Parameter | Always Required ? | Description                                                                                                                                                                           |
| --------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| payload   | Yes               | An object containing order and customer information                                                                                                                                   |
| signature | Yes               | A SHA-512 HMAC hash of the payload, generated using your Secret Key. This ensures the integrity and authenticity of the request. The payload must be JSON-stringified before hashing. |
| onSuccess | No                | A function of your desired action once a payment is successful                                                                                                                        |
| onClose   | No                | A function of your desired action once a payment is canceled                                                                                                                          |
| testMode  | No                | A boolean value to enable test mode. If not included value defaults to false                                                                                                          |
| title     | No                | A string value to change the button title when used as a Button or the radio label when used as a component . If not included value defaults to **Pay with Mima**                     |

### Payload Parameters

| Parameter | Always Required? | Description          |
| --------- | ---------------- | -------------------- |
| customer  | Yes              | Customer Information |
| order     | Yes              | Order Information    |
| publicKey | Yes              | Your API public key  |

### Customer Parameters

| Parameter   | Always Required? | Description                        |
| ----------- | ---------------- | ---------------------------------- |
| fullname    | Yes              | Full name of the customer          |
| email       | Yes              | Email address of the customer      |
| mobile      | No               | Customer's mobile phone number     |
| street      | No               | Street address of the customer     |
| country     | No               | Country where the customer resides |
| companyName | No               | Name of the customer’s company     |
| postCode    | No               | Postal/ZIP code                    |
| state       | No               | State or province                  |

### Order Parameters

| Parameter    | Always Required? | Description                                                                                                                      |
| ------------ | ---------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| items        | Yes              | Array of order items                                                                                                             |
| currencyCode | Yes              | Currency to charge in.                                                                                                           |
| orderId      | Yes              | Your order Id. This MUST be unique for every order so you can be able to receive information on the order related to the payment |
| shipping     | No               | This specifies the cost of shipping. Defaults to 0 when not added.                                                               |

### Items Parameters

Items is an array of objects with these properties

| Parameter | Always Required? | Description                           |
| --------- | ---------------- | ------------------------------------- |
| item      | Yes              | Name of the product or service        |
| quantity  | Yes              | Number of units being purchased       |
| unitPrice | Yes              | Price per unit (in selected currency) |

### Subscriptions

For subscriptions, the SDK integration is similar to the previous methods above. You may either call it directly as a function within your code, or render it as a pre-built button component. Both approaches support the same configuration options, so you can choose whichever method best fits your workflow.

Ensure you have created plans inside the mimapay app for the subscriptions you intend to charge.

#### Subscription Function

```html
<h1>Subscribe</h1>
<button id="my-sub" style="margin: 20px">Pay now</button>

<script>
  const customer = {
    fullname: "John Doe",
    email: "john@example.com",
    mobile: "08012345678",
  };

  const payload = {
    customer,
    plan: "68ac6b678120074a2fd0e2bf",
    amount: 200,
    currencyCode: "NGN",
    publicKey: "fd86a********************4",
  };

  function mySubscription() {
    MimaSubscribe.open({
      payload,
      onSuccess: () => alert("Payment Successful"),
      onClose: () => console.log("Closed"),
      testMode: testMode,
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("my-sub");
    if (btn) {
      btn.addEventListener("click", mySubscription);
    }
  });
</script>
```

#### Subscription Button

Create an empty div with a unique id value, this is where the button will show up

```html
<h1>Subscribe</h1>
<div id="mima-sub"></div>

<script>
  const customer = {
    fullname: "John Doe",
    email: "john@example.com",
    mobile: "08012345678",
  };

  const payload = {
    customer,
    plan: "68ac6b678120074a2fd0e2bf",
    amount: 200,
    currencyCode: "NGN",
    publicKey: "fd86a********************4",
  };

  const subscribe = MimaSubscribe.renderButton({
    selector: "#mima-sub",
    payload,
    onSuccess: () => alert("Payment Successful"),
    onClose: () => console.log("Closed"),
  });
</script>
```

## Subscription Parameters

Read about our checkout parameters and how they can be used

| Parameter | Always Required ? | Description                                                                                                                                                                                    |
| --------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| payload   | Yes               | customer information, plan details and others                                                                                                                                                  |
| onSuccess | No                | A function of your desired action once a payment is successful                                                                                                                                 |
| onClose   | No                | A function of your desired action once a payment is canceled                                                                                                                                   |
| testMode  | No                | A boolean value to enable test mode. If not included value defaults to false                                                                                                                   |
| title     | No                | A string value to change the button title when used as a Button . If not included value defaults to **Pay now**                                                                                |
| selector  | No                | A string id value equivalent to the id given to the empty div if the id in the div is 'mima-sub', **then the selector will be '#mima-sub'**, Selector is required when using the render button |

### Payload Parameters

| Parameter    | Always Required? | Description                                |
| ------------ | ---------------- | ------------------------------------------ |
| customer     | Yes              | Customer Information                       |
| plan         | Yes              | Plan Id (copy from inside the mimapay app) |
| publicKey    | Yes              | Your API public key                        |
| amount       | Yes              | Amount to charge                           |
| currencyCode | Yes              | currency to charge in (NGN or USD)         |

### Customer Parameters

| Parameter | Always Required? | Description                    |
| --------- | ---------------- | ------------------------------ |
| fullname  | Yes              | Full name of the customer      |
| email     | Yes              | Email address of the customer  |
| mobile    | No               | Customer's mobile phone number |
| address   | No               | Street address of the customer |

## Debugging Errors

We understand that you may run into some errors while integrating our library.

For `authorization` and `validation` error responses, double-check your API keys and request. If you get a `server` error or any other error, kindly engage the team for support.

# Support

For additional assistance using this library, please create an issue on the Github repo or contact the developer experience (DX) team via [email](mailto:hello@trymima.com).

You can also follow us [@mimapayafrica](https://x.com/mimapayafrica) and let us know what you think 😊.

## Contribution Guidelines

We welcome contributions from the community. Read more about our community contribution guidelines [here](/CONTRIBUTING.md).

<a id="license"></a>

## License

By contributing to this library, you agree that your contributions will be licensed under its [MIT license](/LICENSE.md).

Copyright (c) Mima Business Inc.

## Contributors

- [Babatunde Nathaniel Shodunke](https://x.com/babszzz)
