const prisma = require("../lib/prisma");
const { createHttpError } = require("../lib/http");
const { deleteCloudinaryImage } = require("../lib/cloudinaryUtils");

async function getProducts() {
  return prisma.product.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
}

async function getProductById(reference) {
  const product = await prisma.product.findUnique({
    where: { reference }
  });

  if (!product) {
    throw createHttpError(404, "Product not found");
  }

  return product;
}

async function createProduct(data) {
  if (!data.name || data.price === undefined || data.price === null) {
    throw createHttpError(400, "Product name and price are required");
  }

  if (!data.reference || typeof data.reference !== "string" || !data.reference.trim()) {
    throw createHttpError(400, "Product reference (SKU) is required and must be unique");
  }

  return prisma.product.create({
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
}

async function updateProduct(reference, data) {
  const existingProduct = await getProductById(reference);

  // If image URL is being changed, delete the old image from Cloudinary
  if (data.imageUrl && data.imageUrl !== existingProduct.imageUrl) {
    await deleteCloudinaryImage(existingProduct.imageUrl);
  }

  return prisma.product.update({
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
}

async function deleteProduct(reference) {
  const product = await getProductById(reference);

  // Delete the product image from Cloudinary before deleting the product
  if (product.imageUrl) {
    await deleteCloudinaryImage(product.imageUrl);
  }

  return prisma.product.delete({
    where: { reference }
  });
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
