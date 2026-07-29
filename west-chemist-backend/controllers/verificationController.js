const Verification = require('../models/Verification');
const Patient = require('../models/Patient');
const { sendVerificationResult } = require('../services/emailService');

/**
 * Upload an ID document and create a pending verification record
 * @route POST /api/verifications/upload
 */
const uploadDocument = async (req, res) => {
  try {
    const { patientId, idType } = req.body;

    if (!patientId || !idType) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID and ID type (passport/license) are required'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an ID document image or PDF file'
      });
    }

    // Verify patient profile exists
    const patientExists = await Patient.findById(patientId);
    if (!patientExists) {
      return res.status(404).json({
        success: false,
        message: 'Associated Patient profile not found'
      });
    }

    // Save document path or Cloudinary URL
    const documentUrl = req.file.path || `/uploads/ids/${req.file.filename}`;

    const verification = await Verification.create({
      patientId,
      idType,
      documentUrl,
      status: 'pending',
      checks: {
        mrz: 'pending',
        blur: 'pending',
        tampering: 'pending',
        readable: 'pending'
      }
    });

    res.status(201).json({
      success: true,
      message: 'ID document uploaded successfully',
      data: verification
    });
  } catch (error) {
    console.error(`❌ Error in uploadDocument: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error uploading ID document',
      error: error.message
    });
  }
};

/**
 * Process identity verification (simulates AI security scanning)
 * @route POST /api/verifications/:id/process
 */
const processVerification = async (req, res) => {
  try {
    const { id } = req.params;

    const verification = await Verification.findById(id);
    if (!verification) {
      return res.status(444).json({
        success: false,
        message: 'Verification record not found'
      });
    }

    const patient = await Patient.findById(verification.patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient associated with verification not found'
      });
    }

    // Simulate scanning processing states
    // In a real-world scenario, we would integrate with an AI verification API like Onfido or Jumio.
    // Here we run a realistic process simulation.
    verification.checks.mrz = 'done';
    verification.checks.blur = 'done';
    verification.checks.tampering = 'done';
    verification.checks.readable = 'done';
    
    verification.status = 'pending';
    
    await verification.save();

    // Trigger compliance notification email asynchronously
    sendVerificationResult(verification, patient).catch(err => {
      console.error(`⚠️ Email sending failed: ${err.message}`);
    });

    res.status(200).json({
      success: true,
      message: 'Identity verification processing completed successfully',
      data: verification
    });
  } catch (error) {
    console.error(`❌ Error in processVerification: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error processing verification',
      error: error.message
    });
  }
};

/**
 * Get verification status for a specific patient
 * @route GET /api/verifications/patient/:patientId
 */
const getPatientVerifications = async (req, res) => {
  try {
    const verifications = await Verification.find({ patientId: req.params.patientId });
    res.status(200).json({
      success: true,
      data: verifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching patient verifications',
      error: error.message
    });
  }
};

module.exports = {
  uploadDocument,
  processVerification,
  getPatientVerifications
};
