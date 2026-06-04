const express = require('express');
const router = express.Router();
const { 
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
} = require('../controllers/appointmentController');

// Patient-facing routes
router.get('/slots', getAvailableSlots);
router.get('/track', getAppointmentsByMobile);
router.post('/book', bookAppointment);
router.get('/patient/:patientId', getPatientAppointments);
router.put('/:id/cancel', cancelAppointment);
router.put('/:id/request-reschedule', requestRescheduleAppointment);
router.get('/:id', getAppointmentById);

// Admin-only routes
router.get('/admin/all', getAllAppointments);
router.put('/:id/approve', adminApproveAppointment);
router.put('/:id/reject', adminRejectAppointment);
router.put('/:id/reschedule', adminRescheduleAppointment);

module.exports = router;
