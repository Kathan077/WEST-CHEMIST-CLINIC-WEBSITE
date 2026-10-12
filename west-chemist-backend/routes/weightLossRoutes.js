const express = require('express');
const router = express.Router();
const {
  getWeightLossCMS,
  updateWeightLossCMS
} = require('../controllers/weightLossController');

// Public route to fetch CMS
router.get('/cms', getWeightLossCMS);

// Admin route to update CMS
router.put('/cms', updateWeightLossCMS);

module.exports = router;
