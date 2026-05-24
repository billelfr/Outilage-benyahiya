const asyncHandler = require("../middlewares/asyncHandler");
const orderService = require("../services/orderService");

const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.body);

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: order
  });
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getOrders();

  res.status(200).json({
    success: true,
    data: orders
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id);

  res.status(200).json({
    success: true,
    data: order
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body.status);

  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    data: order
  });
});

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
};
