const express = require('express');
const router = express.Router();
const {
  getVaccinationCMS,
  updateVaccinationCMS
} = require('../controllers/vaccinationCMSController');

router.get('/', getVaccinationCMS);
router.put('/', updateVaccinationCMS);

module.exports = router;
