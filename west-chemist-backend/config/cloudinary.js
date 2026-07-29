const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Creates a Multer upload instance that uploads to Cloudinary if credentials exist,
 * or falls back to local disk storage in development if Cloudinary is not configured.
 */
function createUploadMiddleware(folderName, allowedFormats = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif', 'pdf']) {
  const isCloudinaryConfigured = 
    process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_CLOUD_NAME !== 'YOUR_CLOUD_NAME_HERE' &&
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_SECRET;

  if (isCloudinaryConfigured) {
    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: `west-chemist/${folderName}`,
        allowed_formats: allowedFormats,
        resource_type: 'auto',
      },
    });

    return multer({
      storage: storage,
      limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
    });
  } else {
    // Local fallback for local development if Cloudinary credentials not set
    const uploadDir = path.join(__dirname, `../uploads/${folderName}`);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const storage = multer.diskStorage({
      destination: (req, file, cb) => cb(null, uploadDir),
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExt = path.extname(file.originalname);
        cb(null, `${folderName}-${uniqueSuffix}${fileExt}`);
      }
    });

    return multer({
      storage: storage,
      limits: { fileSize: 10 * 1024 * 1024 }
    });
  }
}

module.exports = {
  cloudinary,
  createUploadMiddleware
};
