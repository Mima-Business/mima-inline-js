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
