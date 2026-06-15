const asyncHandler = require("../middlewares/asyncHandler");
const productService = require("../services/productService");

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
    imageUrl: req.file?.path || body?.imageUrl || null,
  };

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
    // prefer uploaded file path when present
    imageUrl: req.file?.path || body?.imageUrl || null,
  };

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
