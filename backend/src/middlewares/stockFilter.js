const asyncHandler = require("./asyncHandler");

/**
 * Middleware to filter products based on stock availability (optional)
 * Now returns all products regardless of stock status
 * Users can see out-of-stock products with status indication
 */
const stockFilter = asyncHandler(async (req, res, next) => {
    // Simply pass through to next middleware - no filtering applied
    next();
});

module.exports = stockFilter;

