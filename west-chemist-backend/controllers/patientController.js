const Patient = require('../models/Patient');
const Verification = require('../models/Verification');

/**
 * Register a new patient or retrieve their profile if they already exist
 * @route POST /api/patients/register-or-find
 */
const registerOrFindPatient = async (req, res) => {
  try {
    const { fullName, mobile, email } = req.body;

    if (!fullName || !mobile) {
      return res.status(400).json({ 
        success: false, 
        message: 'Full name and mobile number are required' 
      });
    }

    // Airtight UK Phone Number validation check
    const cleanMobile = mobile.replace(/[\s\-()]/g, '');
    const ukRegex = /^(?:\+44|44|0)\d{9,10}$/;
    if (!ukRegex.test(cleanMobile)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid UK phone number (e.g. 07123456789 or 02079460192)'
      });
    }

    // Attempt to find patient by unique mobile number
    let patient = await Patient.findOne({ mobile: mobile.trim() });

    if (patient) {
      // Update name or email if provided and different
      let updated = false;
      if (fullName && patient.fullName !== fullName.trim()) {
        patient.fullName = fullName.trim();
        updated = true;
      }
      if (email && patient.email !== email.trim()) {
        patient.email = email.trim();
        updated = true;
      }
      
      if (updated) {
        await patient.save();
      }

      // Check verification status
      const verification = await Verification.findOne({ patientId: patient._id }).sort({ createdAt: -1 });
      
      return res.status(200).json({
        success: true,
        message: 'Patient profile retrieved and updated successfully',
        data: {
          ...patient.toObject(),
          verificationStatus: verification ? verification.status : 'none',
          verificationId: verification ? verification._id : null
        }
      });
    }

    // Create a new patient profile
    patient = await Patient.create({
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      email: email ? email.trim() : ''
    });

    res.status(201).json({
      success: true,
      message: 'New patient profile registered successfully',
      data: {
        ...patient.toObject(),
        verificationStatus: 'none',
        verificationId: null
      }
    });
  } catch (error) {
    console.error(`❌ Error in registerOrFindPatient: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error processing patient profile',
      error: error.message
    });
  }
};

/**
 * Get all patients
 * @route GET /api/patients
 */
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching patients',
      error: error.message
    });
  }
};

/**
 * Get single patient by ID
 * @route GET /api/patients/:id
 */
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(444).json({
        success: false,
        message: 'Patient not found'
      });
    }
    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching patient details',
      error: error.message
    });
  }
};

module.exports = {
  registerOrFindPatient,
  getAllPatients,
  getPatientById
};
