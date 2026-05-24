const prisma = require("../lib/prisma");
const { createHttpError } = require("../lib/http");

const allowedStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

function validateOrderItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw createHttpError(400, "At least one order item is required");
  }

  for (const item of items) {
    if (!item.productId || !Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw createHttpError(400, "Each order item must include productId and a positive quantity");
    }
  }
}

function isValidDZPhone(phone) {
  if (!phone) return false;
  const cleaned = phone.toString().replace(/[\s\-\(\)]/g, "");
  return /^(0|\+213|213)([567]\d{8}|[234]\d{7,8})$/.test(cleaned);
}

async function createOrder(payload) {
  const { customerName, customerPhone, customerAddress, items } = payload;

  if (!customerName) {
    throw createHttpError(400, "Customer name is required");
  }

  if (!customerPhone) {
    throw createHttpError(400, "Customer phone number is required");
  }

  if (!isValidDZPhone(customerPhone)) {
    throw createHttpError(400, "Invalid Algerian phone number format. Please use 05, 06, or 07 followed by 8 digits.");
  }

  validateOrderItems(items);

  const productIds = [...new Set(items.map((item) => item.productId))];
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds
      }
    }
  });

  if (products.length !== productIds.length) {
    throw createHttpError(404, "One or more products were not found");
  }

  const productMap = new Map(products.map((product) => [product.id, product]));
  const normalizedItems = items.map((item) => {
    const product = productMap.get(item.productId);

    if (typeof product.stock === "number" && product.stock < item.quantity) {
      throw createHttpError(400, `Insufficient stock for product ${product.name}`);
    }

    return {
      productId: product.id,
      quantity: item.quantity,
      price: product.price
    };
  });

  const totalPrice = normalizedItems.reduce((sum, item) => {
    return sum + Number(item.price) * item.quantity;
  }, 0);

  for (const item of normalizedItems) {
    const product = productMap.get(item.productId);

    if (typeof product.stock === "number") {
      const updateResult = await prisma.product.updateMany({
        where: {
          id: item.productId,
          stock: {
            gte: item.quantity
          }
        },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });

      if (updateResult.count === 0) {
        throw createHttpError(400, `Insufficient stock for product ${product.name}`);
      }
    }
  }

  return prisma.order.create({
    data: {
      customerName,
      customerPhone: customerPhone || null,
      customerAddress: customerAddress || null,
      description: payload.description || null,
      totalPrice,
      orderItems: {
        create: normalizedItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      }
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    }
  });
}

async function getOrders() {
  return prisma.order.findMany({
    orderBy: {
      createdAt: "desc"
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    }
  });
}

async function getOrderById(id) {

  if (!id || id === 'undefined' || id === 'null') {
    throw new Error(`getOrderById called with invalid id: "${id}"`);
  }
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    }
  });

  if (!order) {
    throw createHttpError(404, "Order not found");
  }

  return order;
}

async function updateOrderStatus(id, status) {
  const normalizedStatus = String(status || "").toUpperCase();

  if (!allowedStatuses.includes(normalizedStatus)) {
    throw createHttpError(400, `Status must be one of: ${allowedStatuses.join(", ")}`);
  }

  await getOrderById(id);

  return prisma.order.update({
    where: { id },
    data: { status: normalizedStatus },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    }
  });
}

module.exports = {
  allowedStatuses,
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
};
