const express = require('express');
const router = express.Router();
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

// Admin endpoints (Private/Protected in production, simple endpoints matching the dashboard)
router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

module.exports = router;
