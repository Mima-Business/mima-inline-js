export async function createInvoiceSession({
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

export async function createSubscriptionSession({ baseUrl, path, payload }) {
  const url = `${baseUrl}${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || data?.error) {
    const msg = data?.message || "Something went wrong. Please try again.";
    throw new Error(msg);
  }
  return data;
}

export async function createCustomerSession({ baseUrl, path, payload }) {
  const url = `${baseUrl}${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || data?.error) {
    const msg = data?.message || "Something went wrong. Please try again.";
    throw new Error(msg);
  }
  return data;
}

export async function saveCardSession({ baseUrl, path, payload }) {
  const url = `${baseUrl}${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || data?.error) {
    const msg = data?.message || "Something went wrong. Please try again.";
    throw new Error(msg);
  }
  return data;
}

export async function getPlanDetails({ baseUrl, path, plan, publicKey }) {
  const url = `${baseUrl}${path}?publicKey=${publicKey}&id=${plan}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (!res.ok || data?.error) {
    const msg = data?.message || "Something went wrong. Please try again.";
    throw new Error(msg);
  }
  return data;
}
