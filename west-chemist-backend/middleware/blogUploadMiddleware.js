const { createUploadMiddleware } = require('../config/cloudinary');

// Create blog upload middleware (uses Cloudinary if configured, else local storage)
const blogUpload = createUploadMiddleware('blogs', ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif']);

module.exports = blogUpload;
