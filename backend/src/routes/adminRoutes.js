const express = require("express");

const adminController = require("../controllers/adminController");
const { requireAdminAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", adminController.login);
router.get("/me", requireAdminAuth, adminController.me);

module.exports = router;
