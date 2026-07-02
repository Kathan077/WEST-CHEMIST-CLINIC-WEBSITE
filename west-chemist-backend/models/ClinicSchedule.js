const mongoose = require('mongoose');

const ClinicScheduleSchema = new mongoose.Schema({
  scheduleType: {
    type: String,
    enum: ['default', 'specific-date', 'weekly', 'monthly', 'yearly'],
    required: true,
    index: true
  },
  // For 'specific-date' (e.g. "2026-07-04")
  dateStr: { type: String, index: true },
  
  // For 'weekly' (e.g. 0 = Sunday, 1 = Monday, etc.)
  dayOfWeek: { type: Number, index: true },
  
  // For 'monthly' (e.g. 10th of every month)
  dayOfMonth: { type: Number, index: true },
  
  // For 'yearly' (e.g. month: 11, day: 25 for Christmas)
  month: { type: Number }, // 0-indexed: 0 = Jan, 11 = Dec
  day: { type: Number },
  
  // Slot template details
  slots: [{ type: String }], // e.g. ["09:00 AM", ...]
  duration: { type: Number, default: 15 }, // 10, 15, 20, 30, 45, 60
  buffer: { type: Number, default: 0 },
  maxAppointments: { type: Number, default: 1 },
  lunchStart: { type: String }, // e.g. "01:00 PM"
  lunchEnd: { type: String },   // e.g. "02:00 PM"
  breakStart: { type: String }, // e.g. "11:00 AM"
  breakEnd: { type: String },   // e.g. "11:15 AM"
  
  isClosed: { type: Boolean, default: false },
  branch: { type: String, default: 'default', index: true }
}, { timestamps: true });

module.exports = mongoose.model('ClinicSchedule', ClinicScheduleSchema);
