const { createUploadMiddleware } = require('../config/cloudinary');

// Create ID document upload middleware (uses Cloudinary if configured, else local storage)
const upload = createUploadMiddleware('ids', ['jpg', 'jpeg', 'png', 'pdf']);

module.exports = upload;
