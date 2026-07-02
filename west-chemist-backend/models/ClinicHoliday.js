const mongoose = require('mongoose');

const ClinicHolidaySchema = new mongoose.Schema({
  holidayType: {
    type: String,
    enum: ['specific-date', 'date-range', 'recurring-yearly', 'recurring-monthly'],
    required: true,
    index: true
  },
  // For 'specific-date' and 'date-range'
  startDateStr: { type: String, required: true, index: true },
  endDateStr: { type: String }, // optional, for ranges (inclusive)
  
  // For recurring yearly / monthly
  month: { type: Number }, // 0-indexed: 0 = Jan, 11 = Dec
  day: { type: Number },   // day of month
  
  name: { type: String, default: 'Clinic Holiday' },
  branch: { type: String, default: 'default', index: true }
}, { timestamps: true });

module.exports = mongoose.model('ClinicHoliday', ClinicHolidaySchema);
