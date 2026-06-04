const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient ID is required'],
      index: true
    },
    clinic: {
      type: String,
      required: [true, 'Clinic location is required'],
      trim: true
    },
    service: {
      type: String,
      required: [true, 'Clinical service is required'],
      trim: true
    },
    date: {
      type: String,
      required: [true, 'Appointment date is required (YYYY-MM-DD)'],
      trim: true,
      index: true
    },
    time: {
      type: String,
      required: [true, 'Appointment time is required (HH:MM AM/PM)'],
      trim: true
    },
    verificationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Verification'
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'approved', 'rejected', 'cancelled', 'rescheduled'],
      default: 'pending'
    },
    adminNote: {
      type: String,
      trim: true,
      default: ''
    },
    rescheduledTime: {
      type: String,
      trim: true,
      default: ''
    },
    rescheduledDate: {
      type: String,
      trim: true,
      default: ''
    },
    isRescheduleRequested: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Prevent double bookings at the same clinic, date, and time slot
AppointmentSchema.index({ clinic: 1, date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
