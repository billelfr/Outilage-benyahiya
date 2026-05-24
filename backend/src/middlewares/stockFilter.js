const asyncHandler = require("./asyncHandler");

/**
 * Middleware to filter products based on stock availability
 * Only allows retrieval of products with stock > 0
 * This middleware modifies the response to exclude out-of-stock items
 */
const stockFilter = asyncHandler(async (req, res, next) => {
    // Store the original json method
    const originalJson = res.json;

    // Override the json method to filter products
    res.json = function (data) {
        // If the response contains a data array or object, filter based on stock
        if (data && data.data) {
            if (Array.isArray(data.data)) {
                // Filter out products with stock <= 0
                data.data = data.data.filter((item) => item.stock > 0);
            } else if (data.data.stock !== undefined && data.data.stock <= 0) {
                // For single product endpoint, still ensure it has stock before returning
                // Return 404 if trying to access out-of-stock product
                return originalJson.call(this, {
                    success: false,
                    message: "Product not found",
                });
            }
        }

        return originalJson.call(this, data);
    };

    next();
});

module.exports = stockFilter;
