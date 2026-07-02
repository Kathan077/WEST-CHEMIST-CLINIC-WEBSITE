const express = require('express');
const router = express.Router();
const { 
  registerOrFindPatient, 
  getAllPatients, 
  getPatientById,
  updatePatientStatus
} = require('../controllers/patientController');

// Patient registration/lookup (Step 1)
router.post('/register-or-find', registerOrFindPatient);

// Administrative or helper endpoints
router.get('/', getAllPatients);
router.get('/:id', getPatientById);
router.put('/:id/status', updatePatientStatus);


module.exports = router;
