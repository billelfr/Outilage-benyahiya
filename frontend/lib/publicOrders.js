// lib/publicOrders.js

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || "Order request failed.");
  }
  return data;
}

export async function createOrder(payload) {
  const data = await parseResponse(
    await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }),
  );
  return data.order;
}