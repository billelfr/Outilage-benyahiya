const prisma = require("../lib/prisma");
const { createHttpError } = require("../lib/http");

async function addWishlistItem({ sessionId, productId }) {
  if (!sessionId || !productId) {
    throw createHttpError(400, "sessionId and productId are required");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    throw createHttpError(404, "Product not found");
  }

  return prisma.wishlistItem.upsert({
    where: {
      sessionId_productId: {
        sessionId,
        productId
      }
    },
    update: {},
    create: {
      sessionId,
      productId
    },
    include: {
      product: true
    }
  });
}

async function getWishlistBySessionId(sessionId) {
  if (!sessionId) {
    throw createHttpError(400, "sessionId is required");
  }

  return prisma.wishlistItem.findMany({
    where: { sessionId },
    orderBy: {
      createdAt: "desc"
    },
    include: {
      product: true
    }
  });
}

async function removeWishlistItem(id) {
  const existingItem = await prisma.wishlistItem.findUnique({
    where: { id }
  });

  if (!existingItem) {
    throw createHttpError(404, "Wishlist item not found");
  }

  await prisma.wishlistItem.delete({
    where: { id }
  });
}

module.exports = {
  addWishlistItem,
  getWishlistBySessionId,
  removeWishlistItem
};
