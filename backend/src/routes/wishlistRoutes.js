const express = require("express");

const wishlistController = require("../controllers/wishlistController");

const router = express.Router();

router.post("/", wishlistController.addWishlistItem);
router.get("/:sessionId", wishlistController.getWishlistBySessionId);
router.delete("/:id", wishlistController.removeWishlistItem);

module.exports = router;
