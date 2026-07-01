const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  cat: {
    type: String,
    required: true,
    trim: true
  },
  parentCategory: {
    type: String,
    trim: true
  },
  img: {
    type: String,
    required: true,
    trim: true
  },
  desc: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  features: {
    type: [String],
    default: []
  },
  color: {
    type: String,
    default: '#4B2D71',
    trim: true
  },
  onHome: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
