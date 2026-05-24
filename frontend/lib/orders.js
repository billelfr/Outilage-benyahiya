import { getAdminToken } from "@/lib/auth";

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

export async function fetchOrders() {
  const token = getAdminToken();
  const data = await parseResponse(
    await fetch("/api/orders", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),
  );

  return data.orders || [];
}

export async function updateOrderStatus(id, status) {
  const token = getAdminToken();
  const data = await parseResponse(
    await fetch(`/api/orders/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ status }),
    }),
  );

  return data.order;
}
