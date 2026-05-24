const express = require("express");

const productController = require("../controllers/productController");
const { requireAdminAuth } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const stockFilter = require("../middlewares/stockFilter");

const router = express.Router();

router.get("/", stockFilter, productController.getProducts);
router.get("/:id", stockFilter, productController.getProductById);
router.post("/", requireAdminAuth, upload.single("image"), productController.createProduct);
router.put("/:id", requireAdminAuth, upload.single("image"), productController.updateProduct);
router.delete("/:id", requireAdminAuth, productController.deleteProduct);

module.exports = router;

