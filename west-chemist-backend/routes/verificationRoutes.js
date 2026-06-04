const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { 
  uploadDocument, 
  processVerification, 
  getPatientVerifications 
} = require('../controllers/verificationController');

// ID Upload (Step 2 - attaches document to request and runs Multer validation)
router.post('/upload', upload.single('file'), uploadDocument);

// Process scanned compliance checks (MRZ, blur, tampering, readable)
router.post('/:id/process', processVerification);

// Retrieve checks for a patient
router.get('/patient/:patientId', getPatientVerifications);

module.exports = router;
