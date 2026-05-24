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

async function getProductById(id) {
  const product = await prisma.product.findUnique({
    where: { id }
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

  return prisma.product.create({
    data: {
      name: data.name,
      description: data.description || null,
      category: data.category || null,
      price: data.price,
      imageUrl: data.imageUrl || null,
      stock: data.stock ?? 0
    }
  });
}

async function updateProduct(id, data) {
  const existingProduct = await getProductById(id);

  // If image URL is being changed, delete the old image from Cloudinary
  if (data.imageUrl && data.imageUrl !== existingProduct.imageUrl) {
    await deleteCloudinaryImage(existingProduct.imageUrl);
  }

  return prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      category: data.category,
      price: data.price,
      imageUrl: data.imageUrl,
      stock: data.stock
    }
  });
}

async function deleteProduct(id) {
  const product = await getProductById(id);

  // Delete the product image from Cloudinary before deleting the product
  if (product.imageUrl) {
    await deleteCloudinaryImage(product.imageUrl);
  }

  return prisma.product.delete({
    where: { id }
  });
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
