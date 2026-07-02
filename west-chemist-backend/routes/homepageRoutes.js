const express = require('express');
const router = express.Router();
const {
  getHomepageContent,
  updateHomepageContent,
  seedHomepageContent
} = require('../controllers/homepageController');

// Public endpoints
router.get('/', getHomepageContent);

// Admin endpoints
router.put('/', updateHomepageContent);
router.post('/seed', seedHomepageContent);

module.exports = router;
