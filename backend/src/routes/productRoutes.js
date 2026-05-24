const express = require("express");

const productController = require("../controllers/productController");
const { requireAdminAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.post("/", requireAdminAuth, productController.createProduct);
router.put("/:id", requireAdminAuth, productController.updateProduct);
router.delete("/:id", requireAdminAuth, productController.deleteProduct);

module.exports = router;
