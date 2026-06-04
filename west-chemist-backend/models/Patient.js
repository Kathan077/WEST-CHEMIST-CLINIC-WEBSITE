const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Full name cannot exceed 100 characters']
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      unique: true,
      trim: true,
      index: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

// Virtual for getting all appointments of this patient (optional, but helpful for ref-joins)
PatientSchema.virtual('appointments', {
  ref: 'Appointment',
  localField: '_id',
  foreignField: 'patientId',
  justOne: false
});

module.exports = mongoose.model('Patient', PatientSchema);
