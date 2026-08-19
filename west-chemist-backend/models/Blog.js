const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    default: []
  },
  verificationTitle: {
    type: String,
    default: 'Medically Verified'
  },
  verificationSubtitle: {
    type: String,
    default: 'By PHARMACY Team'
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Blog', BlogSchema);

