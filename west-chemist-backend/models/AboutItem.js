const mongoose = require('mongoose');

const aboutItemSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['hero', 'stat', 'card', 'faq', 'branch', 'impact'],
    trim: true
  },
  title: {
    type: String,
    trim: true,
    default: ''
  },
  content: {
    type: String,
    trim: true,
    default: ''
  },
  icon: {
    type: String,
    trim: true,
    default: ''
  },
  metadata: {
    type: Map,
    of: String,
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model('AboutItem', aboutItemSchema);
