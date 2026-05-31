const prisma = require("../lib/prisma");
const cache = require("../lib/cache");
const { createHttpError } = require("../lib/http");
const { deleteCloudinaryImage } = require("../lib/cloudinaryUtils");

const PRODUCTS_CACHE_KEY = "products:all";
const PRODUCT_CACHE_PREFIX = "products:detail";

async function getProducts() {
  const cachedProducts = await cache.getJson(PRODUCTS_CACHE_KEY);

  if (cachedProducts) {
    return cachedProducts;
  }

  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });

  await cache.setJson(PRODUCTS_CACHE_KEY, products);

  return products;
}

async function getProductById(reference) {
  const cacheKey = `${PRODUCT_CACHE_PREFIX}:${reference}`;
  const cachedProduct = await cache.getJson(cacheKey);

  if (cachedProduct) {
    return cachedProduct;
  }

  const product = await prisma.product.findUnique({
    where: { reference }
  });

  if (!product) {
    throw createHttpError(404, "Product not found");
  }

  await cache.setJson(cacheKey, product);

  return product;
}

async function clearProductCache(reference) {
  await cache.deleteByPattern(PRODUCTS_CACHE_KEY);

  if (reference) {
    await cache.deleteByPattern(`${PRODUCT_CACHE_PREFIX}:${reference}`);
  }
}

async function createProduct(data) {
  if (!data.name || data.price === undefined || data.price === null) {
    throw createHttpError(400, "Product name and price are required");
  }

  if (!data.reference || typeof data.reference !== "string" || !data.reference.trim()) {
    throw createHttpError(400, "Product reference (SKU) is required and must be unique");
  }

  const product = await prisma.product.create({
    data: {
      reference: data.reference.trim(),
      name: data.name,
      description: data.description || null,
      category: data.category || null,
      price: data.price,
      imageUrl: data.imageUrl || null,
      isAvailable: data.isAvailable ?? true,
      isNouvellite: data.isNouvellite ?? false,
      isPromotion: data.isPromotion ?? false,
    }
  });

  await clearProductCache(product.reference);

  return product;
}

async function updateProduct(reference, data) {
  const existingProduct = await getProductById(reference);

  // If image URL is being changed, delete the old image from Cloudinary
  if (data.imageUrl && data.imageUrl !== existingProduct.imageUrl) {
    await deleteCloudinaryImage(existingProduct.imageUrl);
  }

  const product = await prisma.product.update({
    where: { reference },
    data: {
      name: data.name,
      description: data.description,
      category: data.category,
      price: data.price,
      imageUrl: data.imageUrl,
      isAvailable: data.isAvailable,
      isNouvellite: data.isNouvellite,
      isPromotion: data.isPromotion,
    }
  });

  await clearProductCache(reference);

  return product;
}

async function deleteProduct(reference) {
  const product = await getProductById(reference);

  // Delete the product image from Cloudinary before deleting the product
  if (product.imageUrl) {
    await deleteCloudinaryImage(product.imageUrl);
  }

  const deletedProduct = await prisma.product.delete({
    where: { reference }
  });

  await clearProductCache(reference);

  return deletedProduct;
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
