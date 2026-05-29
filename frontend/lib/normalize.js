function toNumber(value) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

export function getEntityId(entity) {
  return String(entity?.id || entity?._id || entity?.uuid || entity?.slug || "");
}

export function normalizeProduct(product = {}) {
  const stock = toNumber(product.stock || product.inventory || product.quantity || 0);
  const reference = product.reference || product.sku || "";
  return {
    id: reference,
    name: product.name || product.title || "Untitled product",
    description: product.description || product.details || "No description provided yet.",
    category: product.category || product.collection || "General",
    image: product.image || product.imageUrl || product.thumbnail || product.photo || "",
    price: toNumber(product.price || product.amount || product.unitPrice),
    reference: reference,
    stock: stock,
    inStock: stock > 0,
    featured: Boolean(product.featured || product.isFeatured),
    raw: product,
  };
}

export function normalizeOrder(order = {}) {
  return {
    id: getEntityId(order),
    status: String(order.status || order.state || "pending").toLowerCase(),
    createdAt: order.createdAt || order.created_at || order.date || null,
    total: toNumber(order.total_price || order.totalPrice || order.total || order.amount || order.grandTotal),
    customerName:
      order.user_name ||
      order.customerName ||
      order.name ||
      order.customer?.name ||
      order.shippingAddress?.name ||
      "Guest customer",
    customerEmail: order.user_email || order.email || order.customer?.email || "",
    customerPhone: order.user_phone || order.phone || order.customer?.phone || "",
    address: order.address || order.customerAddress || order.shippingAddress?.address || "",
    description:
      order.description ||
      order.note ||
      order.notes ||
      order.customerNote ||
      order.deliveryInstructions ||
      "",
    items: (Array.isArray(order.orderItems)
      ? order.orderItems
      : Array.isArray(order.items)
        ? order.items
        : Array.isArray(order.products)
          ? order.products
          : []
    ).map((item) => ({
      id: getEntityId(item),
      name: item.name || item.title || item.product?.name || "Unknown item",
      quantity: Number(item.quantity) || 0,
      price: toNumber(item.price || item.product?.price),
      raw: item,
    })),
    raw: order,
  };
}

export function normalizeAdminUser(admin = {}) {
  return {
    id: getEntityId(admin),
    name: admin.name || admin.fullName || admin.username || "Admin",
    email: admin.email || "",
    raw: admin,
  };
}
