const express = require('express');
const router = express.Router();
const {
  getAllContents,
  getContentByKey,
  updateContentByKey
} = require('../controllers/contentController');

// Public endpoints
router.get('/', getAllContents);
router.get('/:key', getContentByKey);

// Admin endpoints
router.put('/:key', updateContentByKey);

module.exports = router;
