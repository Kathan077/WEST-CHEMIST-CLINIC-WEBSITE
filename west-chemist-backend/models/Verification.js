const mongoose = require('mongoose');

const VerificationSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient ID is required'],
      index: true
    },
    idType: {
      type: String,
      required: [true, 'ID document type is required'],
      enum: {
        values: ['passport', 'license'],
        message: '{VALUE} is not a valid ID type (passport or license allowed)'
      }
    },
    documentUrl: {
      type: String,
      required: [true, 'ID document file path is required']
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    checks: {
      mrz: {
        type: String,
        enum: ['pending', 'processing', 'done', 'failed'],
        default: 'pending'
      },
      blur: {
        type: String,
        enum: ['pending', 'processing', 'done', 'failed'],
        default: 'pending'
      },
      tampering: {
        type: String,
        enum: ['pending', 'processing', 'done', 'failed'],
        default: 'pending'
      },
      readable: {
        type: String,
        enum: ['pending', 'processing', 'done', 'failed'],
        default: 'pending'
      }
    },
    verifiedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Verification', VerificationSchema);
