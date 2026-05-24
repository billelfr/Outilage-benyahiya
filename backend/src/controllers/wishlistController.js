const asyncHandler = require("../middlewares/asyncHandler");
const wishlistService = require("../services/wishlistService");

const addWishlistItem = asyncHandler(async (req, res) => {
  const item = await wishlistService.addWishlistItem(req.body);

  res.status(201).json({
    success: true,
    message: "Wishlist item added successfully",
    data: item
  });
});

const getWishlistBySessionId = asyncHandler(async (req, res) => {
  const items = await wishlistService.getWishlistBySessionId(req.params.sessionId);

  res.status(200).json({
    success: true,
    data: items
  });
});

const removeWishlistItem = asyncHandler(async (req, res) => {
  await wishlistService.removeWishlistItem(req.params.id);

  res.status(200).json({
    success: true,
    message: "Wishlist item removed successfully"
  });
});

module.exports = {
  addWishlistItem,
  getWishlistBySessionId,
  removeWishlistItem
};
