const express = require("express");

const adminRoutes = require("./adminRoutes");
const orderRoutes = require("./orderRoutes");
const productRoutes = require("./productRoutes");
const wishlistRoutes = require("./wishlistRoutes");

const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/orders", orderRoutes);
router.use("/products", productRoutes);
router.use("/wishlist", wishlistRoutes);

module.exports = router;
