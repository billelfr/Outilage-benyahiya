const express = require("express");

const orderController = require("../controllers/orderController");
const { requireAdminAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", orderController.createOrder);
router.get("/", requireAdminAuth, orderController.getOrders);
router.get("/:id", orderController.getOrderById);
router.patch("/:id/status", requireAdminAuth, orderController.updateOrderStatus);

module.exports = router;
