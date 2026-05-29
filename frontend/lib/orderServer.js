const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "");

const ALLOWED_ORDER_STATUSES = ["pending", "confirmed", "delivered"];

function normalizeItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Order must include at least one item.");
  }

  return items.map((item) => ({
    productRef: String(item.productRef || item.id || item.productId || ""),
    name: String(item.name || "Product"),
    quantity: Math.max(1, Number(item.quantity) || 1),
    price: Number(item.price) || 0,
  }));
}

function isValidDZPhone(phone) {
  if (!phone) return false;
  const cleaned = phone.toString().replace(/[\s\-\(\)]/g, "");
  return /^(0|\+213|213)([567]\d{8}|[234]\d{7,8})$/.test(cleaned);
}

function assertNoPaymentData(payload) {
  const blockedKeys = ["card", "cvv", "cvc", "expiry", "payment_method", "paymentmethod"];

  function inspectKeys(value) {
    if (!value || typeof value !== "object") {
      return false;
    }

    if (Array.isArray(value)) {
      return value.some(inspectKeys);
    }

    return Object.entries(value).some(([key, nestedValue]) => {
      const normalizedKey = key.toLowerCase();
      return blockedKeys.some((blockedKey) => normalizedKey.includes(blockedKey)) || inspectKeys(nestedValue);
    });
  }

  if (inspectKeys(payload)) {
    throw new Error("Payment card fields are not accepted by this order flow.");
  }
}

async function parseApiResponse(response, fallbackMessage) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || data?.error || fallbackMessage);
  }

  return data;
}

function toStorefrontOrder(order, email = "") {
  return {
    id: order.id,
    user_name: order.customerName,
    description: order.description || "",
    user_email: email,
    user_phone: order.customerPhone,
    address: order.customerAddress,
    items: Array.isArray(order.orderItems) ? order.orderItems : [],
    total_price: order.totalPrice,
    status: String(order.status || "PENDING").toLowerCase(),
    created_at: order.createdAt,
    raw: order,
  };
}

export async function createOrderRecord(payload) {
  assertNoPaymentData(payload);

  const items = normalizeItems(payload.items);
  const totalPrice = Number(payload.total_price ?? payload.totalPrice);

  if (!payload.user_name || !payload.user_phone || !payload.address) {
    throw new Error("Name, phone, and address are required.");
  }

  if (!isValidDZPhone(payload.user_phone)) {
    throw new Error("Invalid Algerian phone number format. Please use a valid mobile (05, 06, 07) or landline number.");
  }

  if (!Number.isFinite(totalPrice) || totalPrice <= 0) {
    throw new Error("Order total must be greater than zero.");
  }

  const data = await parseApiResponse(
    await fetch(`${API_BASE_URL}/api/orders`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerName: payload.user_name.trim(),
        customerPhone: payload.user_phone.trim(),
        description: payload.description ? String(payload.description).trim() : undefined,
        customerAddress: payload.address.trim(),
        items: items.map((item) => ({
          productRef: item.productRef,
          quantity: item.quantity,
        })),
      }),
      cache: "no-store",
    }),
    "Could not create order.",
  );

  return toStorefrontOrder(data?.data || data?.order || data, payload.user_email.trim());
}

export async function listOrderRecords(authorization) {
  const data = await parseApiResponse(
    await fetch(`${API_BASE_URL}/api/orders`, {
      headers: {
        Accept: "application/json",
        ...(authorization ? { Authorization: authorization } : {}),
      },
      cache: "no-store",
    }),
    "Could not load orders.",
  );

  const orders = Array.isArray(data?.data) ? data.data : data?.orders || [];
  return orders.map((order) => toStorefrontOrder(order));
}

export async function updateOrderRecordStatus(id, nextStatus, authorization) {
  const status = String(nextStatus || "").toLowerCase();

  if (!ALLOWED_ORDER_STATUSES.includes(status)) {
    throw new Error("Invalid order status.");
  }

  const data = await parseApiResponse(
    await fetch(`${API_BASE_URL}/api/orders/${id}/status`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(authorization ? { Authorization: authorization } : {}),
      },
      body: JSON.stringify({ status: status.toUpperCase() }),
      cache: "no-store",
    }),
    "Could not update order status.",
  );

  return toStorefrontOrder(data?.data || data?.order || data);
}
