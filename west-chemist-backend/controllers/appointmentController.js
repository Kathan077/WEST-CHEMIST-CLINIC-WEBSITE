const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Verification = require('../models/Verification');
const slotService = require('../services/slotService');
const emailService = require('../services/emailService');

/**
 * Get available slots for a specific clinic and date
 * @route GET /api/appointments/slots
 */
const getAvailableSlots = async (req, res) => {
  try {
    const { clinic, date } = req.query;

    if (!clinic || !date) {
      return res.status(400).json({
        success: false,
        message: 'Clinic location and date (YYYY-MM-DD) are required query parameters'
      });
    }

    const slots = await slotService.getAvailableSlots(clinic, date);
    
    res.status(200).json({
      success: true,
      clinic,
      date,
      slots
    });
  } catch (error) {
    console.error(`❌ Error in getAvailableSlots: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving available slots',
      error: error.message
    });
  }
};

/**
 * Book an appointment
 * @route POST /api/appointments/book
 */
const bookAppointment = async (req, res) => {
  try {
    const { patientId, clinic, service, date, time, verificationId } = req.body;

    // Validate inputs
    if (!patientId || !clinic || !service || !date || !time || !verificationId) {
      return res.status(400).json({
        success: false,
        message: 'All fields (patientId, clinic, service, date, time, verificationId) are required'
      });
    }

    // Check if the appointment date is today and if the time slot has already passed
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const apptDateStr = date.split('T')[0];

    if (apptDateStr === todayStr) {
      const match = time.match(/^(\d{2}):(\d{2})\s*(AM|PM)$/i);
      if (match) {
        let hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        const ampm = match[3].toUpperCase();

        if (ampm === 'PM' && hours < 12) {
          hours += 12;
        } else if (ampm === 'AM' && hours === 12) {
          hours = 0;
        }

        const slotDateTime = new Date();
        slotDateTime.setHours(hours, minutes, 0, 0);

        if (today.getTime() > slotDateTime.getTime()) {
          return res.status(400).json({
            success: false,
            message: 'This time slot has already passed today. Please select a future time slot.'
          });
        }
      }
    }

    // Verify patient profile
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found'
      });
    }

    if (patient.status === 'blocked') {
      return res.status(403).json({
        success: false,
        message: 'This patient account has been blocked. Please contact the clinic for assistance.'
      });
    }

    // Verify verification document exists and is approved
    const verification = await Verification.findById(verificationId);
    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Identity verification record not found'
      });
    }

    if (verification.status === 'rejected') {
      return res.status(400).json({
        success: false,
        message: 'Appointment cannot be booked. Your identity verification was rejected.'
      });
    }

    // All appointments start as pending until approved by the admin.
    const initialStatus = 'pending';

    // Check if slot is already booked (prevent race conditions or duplicate booking)
    const existingBooking = await Appointment.findOne({
      clinic,
      date,
      time,
      status: { $ne: 'cancelled' }
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: 'This time slot has already been reserved. Please select another slot.'
      });
    }

    // Create the appointment
    const appointment = await Appointment.create({
      patientId,
      clinic,
      service,
      date,
      time,
      verificationId,
      status: initialStatus
    });

    // Send booking received email asynchronously
    emailService.sendBookingReceived(appointment, patient).catch(err => {
      console.error(`⚠️ Failed to send booking received email: ${err.message}`);
    });

    res.status(201).json({
      success: true,
      message: 'Appointment successfully scheduled and confirmed!',
      data: appointment
    });
  } catch (error) {
    console.error(`❌ Error in bookAppointment: ${error.message}`);
    // Handle mongoose unique index constraint duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Double-booking conflict. This time slot is already booked.'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error booking appointment',
      error: error.message
    });
  }
};

/**
 * Get all appointments for a patient
 * @route GET /api/appointments/patient/:patientId
 */
const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.patientId })
      .sort({ date: 1, time: 1 });
      
    res.status(200).json({
      success: true,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving appointments',
      error: error.message
    });
  }
};

/**
 * Cancel an appointment
 * @route PUT /api/appointments/:id/cancel
 */
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(444).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment successfully cancelled and slot released',
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error cancelling appointment',
      error: error.message
    });
  }
};

/**
 * Track/Get appointments by mobile number
 * @route GET /api/appointments/track
 */
const getAppointmentsByMobile = async (req, res) => {
  try {
    const { mobile } = req.query;
    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required'
      });
    }

    const patient = await Patient.findOne({ mobile: mobile.trim() });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'No patient record found for this mobile number'
      });
    }

    const appointments = await Appointment.find({ patientId: patient._id })
      .sort({ date: -1, time: -1 });

    res.status(200).json({
      success: true,
      patient: {
        id: patient._id,
        fullName: patient.fullName,
        mobile: patient.mobile
      },
      appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error tracking appointments',
      error: error.message
    });
  }
};

/**
 * Get ALL appointments (admin-only, with patient details populated)
 * @route GET /api/appointments/admin/all
 */
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .sort({ date: -1, time: -1 })
      .populate('patientId', 'fullName mobile email')
      .populate('verificationId', 'status idType');

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error(`❌ Error in getAllAppointments: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving all appointments',
      error: error.message
    });
  }
};

/**
 * Admin Approve Appointment
 * @route PUT /api/appointments/:id/approve
 */
const adminApproveAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNote } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.isRescheduleRequested) {
      const oldDate = appointment.date;
      const oldTime = appointment.time;
      
      // Promote proposed slot to main slot
      appointment.date = appointment.rescheduledDate;
      appointment.time = appointment.rescheduledTime;
      
      // Store old schedule in rescheduled fields for history
      appointment.rescheduledDate = oldDate;
      appointment.rescheduledTime = oldTime;
      appointment.isRescheduleRequested = false;
      appointment.status = 'rescheduled';
      appointment.adminNote = adminNote || `Proposed reschedule approved by Superintendent Pharmacist.`;
    } else {
      appointment.status = 'approved';
      appointment.adminNote = adminNote || 'Approved by admin';
    }
    
    await appointment.save();

    if (appointment.verificationId) {
      await Verification.findByIdAndUpdate(appointment.verificationId, {
        status: 'approved',
        verifiedAt: new Date()
      });
    }

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patientId', 'fullName mobile email')
      .populate('verificationId', 'status idType');

    // Send booking confirmation email asynchronously on admin approval
    emailService.sendBookingConfirmation(populatedAppointment, populatedAppointment.patientId).catch(err => {
      console.error(`⚠️ Failed to send booking confirmation email: ${err.message}`);
    });

    res.status(200).json({
      success: true,
      message: appointment.status === 'rescheduled' 
        ? 'Reschedule request approved successfully' 
        : 'Appointment approved successfully',
      data: populatedAppointment
    });
  } catch (error) {
    console.error(`❌ Error in adminApproveAppointment: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error approving appointment', error: error.message });
  }
};

/**
 * Admin Reject Appointment
 * @route PUT /api/appointments/:id/reject
 */
const adminRejectAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNote } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = 'rejected';
    appointment.adminNote = adminNote || 'Rejected by admin';
    await appointment.save();

    if (appointment.verificationId) {
      await Verification.findByIdAndUpdate(appointment.verificationId, {
        status: 'rejected'
      });
    }

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patientId', 'fullName mobile email')
      .populate('verificationId', 'status idType');

    res.status(200).json({
      success: true,
      message: 'Appointment rejected',
      data: populatedAppointment
    });
  } catch (error) {
    console.error(`❌ Error in adminRejectAppointment: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error rejecting appointment', error: error.message });
  }
};

/**
 * Admin Reschedule Appointment (change time/date)
 * @route PUT /api/appointments/:id/reschedule
 */
const adminRescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { newDate, newTime, adminNote } = req.body;

    if (!newDate || !newTime) {
      return res.status(400).json({ success: false, message: 'newDate and newTime are required' });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Check for conflicts at the new slot (excluding this appointment)
    const conflict = await Appointment.findOne({
      clinic: appointment.clinic,
      date: newDate,
      time: newTime,
      status: { $ne: 'cancelled' },
      _id: { $ne: id }
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: 'The new time slot is already booked. Please choose another slot.'
      });
    }

    appointment.rescheduledDate = appointment.date;
    appointment.rescheduledTime = appointment.time;
    appointment.date = newDate;
    appointment.time = newTime;
    appointment.status = 'rescheduled';
    appointment.adminNote = adminNote || `Rescheduled by admin to ${newDate} at ${newTime}`;
    await appointment.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patientId', 'fullName mobile email')
      .populate('verificationId', 'status idType');

    res.status(200).json({
      success: true,
      message: `Appointment rescheduled to ${newDate} at ${newTime}`,
      data: populatedAppointment
    });
  } catch (error) {
    console.error(`❌ Error in adminRescheduleAppointment: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error rescheduling appointment', error: error.message });
  }
};

/**
 * Get single appointment by ID
 * @route GET /api/appointments/:id
 */
const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id)
      .populate('patientId', 'fullName mobile email')
      .populate('verificationId', 'status idType');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error(`❌ Error in getAppointmentById: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving appointment',
      error: error.message
    });
  }
};

/**
 * Patient Request Reschedule Appointment
 * @route PUT /api/appointments/:id/request-reschedule
 */
const requestRescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { newDate, newTime } = req.body;

    if (!newDate || !newTime) {
      return res.status(400).json({ success: false, message: 'newDate and newTime are required' });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Check for conflicts at the new slot (excluding this appointment)
    const conflict = await Appointment.findOne({
      clinic: appointment.clinic,
      date: newDate,
      time: newTime,
      status: { $ne: 'cancelled' },
      _id: { $ne: id }
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: 'The selected slot is already booked. Please choose another date or time.'
      });
    }

    // Update proposed rescheduled date and time, set status to pending, flag request
    appointment.rescheduledDate = newDate;
    appointment.rescheduledTime = newTime;
    appointment.isRescheduleRequested = true;
    appointment.status = 'pending';
    appointment.adminNote = `Proposed reschedule to ${newDate} at ${newTime} (Awaiting Pharmacist Audit)`;
    await appointment.save();

    res.status(200).json({
      success: true,
      message: `Reschedule request submitted for ${newDate} at ${newTime}`,
      data: appointment
    });
  } catch (error) {
    console.error(`❌ Error in requestRescheduleAppointment: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error requesting reschedule', error: error.message });
  }
};

module.exports = {
  getAvailableSlots,
  bookAppointment,
  getPatientAppointments,
  cancelAppointment,
  getAppointmentsByMobile,
  getAllAppointments,
  adminApproveAppointment,
  adminRejectAppointment,
  adminRescheduleAppointment,
  getAppointmentById,
  requestRescheduleAppointment
};
