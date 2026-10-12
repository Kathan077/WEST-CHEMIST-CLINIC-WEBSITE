const express = require('express');
const router = express.Router();
const {
  getServicesCMS,
  updateServicesCMS
} = require('../controllers/servicesCMSController');

// Public route to get Services CMS data
router.get('/', getServicesCMS);

// Route to update Services CMS data
router.put('/', updateServicesCMS);

module.exports = router;
