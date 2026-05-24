const asyncHandler = require("../middlewares/asyncHandler");
const { loginAdmin } = require("../services/adminService");

const login = asyncHandler(async (req, res) => {
  const result = await loginAdmin(req.body.email, req.body.password);

  res.status(200).json({
    success: true,
    message: "Admin logged in successfully",
    data: result
  });
});

const me = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.admin
  });
});

module.exports = {
  login,
  me
};
