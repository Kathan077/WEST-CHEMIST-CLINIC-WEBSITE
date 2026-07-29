const express = require('express');
const router = express.Router();
const serviceUpload = require('../middleware/serviceUploadMiddleware');
const {
  getAllServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');

// Public endpoints
router.get('/', getAllServices);
router.get('/:slug', getServiceBySlug);

// Service Image Upload Endpoint
router.post('/upload', serviceUpload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided for upload'
      });
    }

    const fileUrl = req.file.path || `/uploads/services/${req.file.filename}`;
    res.status(200).json({
      success: true,
      message: 'Service image uploaded successfully',
      url: fileUrl,
      filename: req.file.filename || req.file.public_id
    });
  } catch (error) {
    console.error(`💥 Error uploading service image: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to process service image upload',
      error: error.message
    });
  }
});

// Admin CRUD endpoints
router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

module.exports = router;

