const prisma = require("../lib/prisma");
const cache = require("../lib/cache");
const { createHttpError } = require("../lib/http");
const { deleteCloudinaryImage } = require("../lib/cloudinaryUtils");

const PRODUCTS_CACHE_KEY = "products:all";
const PRODUCT_CACHE_PREFIX = "products:detail";

function normalizeImages(data) {
  if (Array.isArray(data.images)) {
    return data.images.filter(Boolean).slice(0, 6);
  }

  return [data.imageUrl].filter(Boolean);
}

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

  if (data.isPromotion && (!Number.isFinite(data.promotionPrice) || data.promotionPrice <= 0)) {
    throw createHttpError(400, "Promotion price is required for promotional products");
  }

  const images = normalizeImages(data);

  if (images.length === 0) {
    throw createHttpError(400, "At least one product image is required");
  }

  const product = await prisma.product.create({
    data: {
      reference: data.reference.trim(),
      name: data.name,
      description: data.description || null,
      category: data.category || null,
      price: data.price,
      promotionPrice: data.isPromotion ? data.promotionPrice : null,
      imageUrl: images[0] || null,
      images,
      isAvailable: data.isAvailable ?? true,
      isNouvellite: data.isNouvellite ?? false,
      isPromotion: data.isPromotion ?? false,
      featured: data.featured ?? false,
    }
  });

  await clearProductCache(product.reference);

  return product;
}

async function updateProduct(reference, data) {
  const existingProduct = await getProductById(reference);

  if (data.isPromotion && (!Number.isFinite(data.promotionPrice) || data.promotionPrice <= 0)) {
    throw createHttpError(400, "Promotion price is required for promotional products");
  }

  const images = normalizeImages(data);

  if (images.length === 0) {
    throw createHttpError(400, "At least one product image is required");
  }

  const previousImages = Array.isArray(existingProduct.images) && existingProduct.images.length > 0
    ? existingProduct.images
    : [existingProduct.imageUrl].filter(Boolean);
  const nextImageSet = new Set(images);

  for (const previousImage of previousImages) {
    if (!nextImageSet.has(previousImage)) {
      await deleteCloudinaryImage(previousImage);
    }
  }

  const product = await prisma.product.update({
    where: { reference },
    data: {
      name: data.name,
      description: data.description,
      category: data.category,
      price: data.price,
      promotionPrice: data.isPromotion ? data.promotionPrice : null,
      imageUrl: images[0] || null,
      images,
      isAvailable: data.isAvailable,
      isNouvellite: data.isNouvellite,
      isPromotion: data.isPromotion,
      featured: data.featured ?? false,
    }
  });

  await clearProductCache(reference);

  return product;
}

async function deleteProduct(reference) {
  const product = await getProductById(reference);

  const productImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.imageUrl].filter(Boolean);

  for (const imageUrl of productImages) {
    await deleteCloudinaryImage(imageUrl);
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
