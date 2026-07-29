const { createUploadMiddleware } = require('../config/cloudinary');

// Create service upload middleware (uses Cloudinary if configured, else local storage)
const serviceUpload = createUploadMiddleware('services', ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif']);

module.exports = serviceUpload;
