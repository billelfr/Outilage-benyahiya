const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../lib/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "products",
        format: async (req, file) => "webp",
        transformation: [{ width: 800, crop: "limit", quality: "auto" }],
    },
});

const upload = multer({ storage });

module.exports = upload;
