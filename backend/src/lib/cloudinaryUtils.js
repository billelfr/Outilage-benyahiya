const cloudinary = require("./cloudinary");

/**
 * Extract public ID from Cloudinary URL
 * URL format: https://res.cloudinary.com/cloud_name/image/upload/v{version}/{public_id}.{extension}
 * @param {string} imageUrl - The Cloudinary image URL
 * @returns {string|null} - The public ID or null if invalid URL
 */
function extractPublicIdFromUrl(imageUrl) {
    if (!imageUrl || typeof imageUrl !== "string") {
        return null;
    }

    try {
        // Match Cloudinary URL pattern
        const match = imageUrl.match(/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
        return match ? match[1] : null;
    } catch (error) {
        console.error("Error extracting public ID from URL:", error);
        return null;
    }
}

/**
 * Delete image from Cloudinary
 * @param {string} imageUrl - The Cloudinary image URL
 * @returns {Promise<void>}
 */
async function deleteCloudinaryImage(imageUrl) {
    if (!imageUrl) {
        return;
    }

    try {
        const publicId = extractPublicIdFromUrl(imageUrl);

        if (!publicId) {
            console.warn(`Could not extract public ID from URL: ${imageUrl}`);
            return;
        }

        await cloudinary.uploader.destroy(publicId);
        console.log(`Deleted Cloudinary image: ${publicId}`);
    } catch (error) {
        console.error("Error deleting Cloudinary image:", error);
        // Don't throw error, just log it so product deletion continues
    }
}

module.exports = {
    deleteCloudinaryImage,
    extractPublicIdFromUrl,
};
