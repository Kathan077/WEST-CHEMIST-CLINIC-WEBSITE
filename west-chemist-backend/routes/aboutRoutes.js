const express = require('express');
const router = express.Router();
const {
  getAboutItems,
  createAboutItem,
  updateAboutItem,
  deleteAboutItem
} = require('../controllers/aboutController');

// Public endpoints
router.get('/', getAboutItems);

// Admin endpoints (Private/Admin - can be auth-protected, but keep it accessible matching other content updates)
router.post('/', createAboutItem);
router.put('/:id', updateAboutItem);
router.delete('/:id', deleteAboutItem);

module.exports = router;
