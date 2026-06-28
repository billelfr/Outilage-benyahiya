const asyncHandler = require("../middlewares/asyncHandler");
const productService = require("../services/productService");

function getImageUrls(req, body) {
  const uploadedUrls = Array.isArray(req.files) ? req.files.map((file) => file.path).filter(Boolean) : [];
  const existingUrls = Array.isArray(body.imageUrls)
    ? body.imageUrls
    : body.imageUrls
      ? [body.imageUrls]
      : [];
  const legacyUrl = body.imageUrl ? [body.imageUrl] : [];

  return [...existingUrls, ...legacyUrl, ...uploadedUrls].filter(Boolean).slice(0, 6);
}

const getProducts = asyncHandler(async (req, res) => {
  const products = await productService.getProducts();

  res.status(200).json({
    success: true,
    data: products
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const reference = decodeURIComponent(req.params.id);
  const product = await productService.getProductById(reference);

  res.status(200).json({
    success: true,
    data: product
  });
});

const createProduct = asyncHandler(async (req, res) => {
  const body = req.body || {};
  const payload = {
    ...body,
    price: body.price !== undefined ? Number(body.price) : body.price,
    promotionPrice: body.promotionPrice ? Number(body.promotionPrice) : null,
    isAvailable: body.isAvailable === "true" ? true : body.isAvailable === "false" ? false : true,
    isNouvellite: body.isNouvellite === "true" ? true : false,
    isPromotion: body.isPromotion === "true" ? true : false,
    featured: body.featured === "true" ? true : false,
    images: getImageUrls(req, body),
  };
  payload.imageUrl = payload.images[0] || null;

  const product = await productService.createProduct(payload);

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const reference = decodeURIComponent(req.params.id);
  const body = req.body || {};
  const payload = {
    ...body,
    price: body.price !== undefined ? Number(body.price) : body.price,
    promotionPrice: body.promotionPrice ? Number(body.promotionPrice) : null,
    isAvailable: body.isAvailable === "true" ? true : body.isAvailable === "false" ? false : body.isAvailable,
    isNouvellite: body.isNouvellite === "true" ? true : body.isNouvellite === "false" ? false : body.isNouvellite,
    isPromotion: body.isPromotion === "true" ? true : body.isPromotion === "false" ? false : body.isPromotion,
    featured: body.featured === "true" ? true : body.featured === "false" ? false : body.featured,
    images: getImageUrls(req, body),
  };
  payload.imageUrl = payload.images[0] || null;

  const product = await productService.updateProduct(reference, payload);

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const reference = decodeURIComponent(req.params.id);
  await productService.deleteProduct(reference);

  res.status(200).json({
    success: true,
    message: "Product deleted successfully"
  });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
