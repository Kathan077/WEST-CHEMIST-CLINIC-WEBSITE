const express = require('express');
const router = express.Router();
const { 
  getAllBlogs, 
  getBlogBySlug, 
  createBlog, 
  updateBlog, 
  deleteBlog 
} = require('../controllers/blogController');
const blogUpload = require('../middleware/blogUploadMiddleware');

// Get all blogs and single blog by slug
router.get('/', getAllBlogs);
router.get('/:slug', getBlogBySlug);

// Admin-facing actions (direct CRUD on blogs)
router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

// Multiple image upload route (accepts form field 'files' up to 5 files)
router.post('/upload', blogUpload.array('files', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files were uploaded.'
      });
    }

    // Map files to their static access URLs or Cloudinary URLs
    const filePaths = req.files.map(file => file.path || `/uploads/blogs/${file.filename}`);

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully!',
      urls: filePaths
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error processing file upload',
      error: error.message
    });
  }
});

module.exports = router;
