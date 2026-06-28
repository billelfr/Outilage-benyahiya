const multer = require("multer");
const cloudinary = require("../lib/cloudinary");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type. Use JPG, PNG, WebP, GIF or AVIF."));
    }
  },
});

async function uploadBufferToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "products",
        format: "webp",
        transformation: [{ width: 800, crop: "limit", quality: "auto" }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    // Write the buffer directly to the upload stream — the correct way
    stream.end(buffer);
  });
}

async function processUploadedImages(req, res, next) {
  if (!req.files || req.files.length === 0) {
    return next();
  }
  try {
    const results = await Promise.all(
      req.files.map((file) => uploadBufferToCloudinary(file.buffer))
    );
    // Replace req.files with Cloudinary results in the shape controllers expect
    req.files = results.map((result) => ({ path: result.secure_url }));
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { upload, processUploadedImages };
