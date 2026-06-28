const express = require("express");

const productController = require("../controllers/productController");
const { requireAdminAuth } = require("../middlewares/authMiddleware");
const { upload, processUploadedImages } = require("../middlewares/upload");
const stockFilter = require("../middlewares/stockFilter");

const router = express.Router();

router.get("/", stockFilter, productController.getProducts);
router.get("/:id", stockFilter, productController.getProductById);
router.post("/", requireAdminAuth, upload.array("images", 6), processUploadedImages, productController.createProduct);
router.put("/:id", requireAdminAuth, upload.array("images", 6), processUploadedImages, productController.updateProduct);
router.delete("/:id", requireAdminAuth, productController.deleteProduct);

module.exports = router;
