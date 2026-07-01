const mongoose = require('mongoose');

const pageContentSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    trim: true
  },
  section: {
    type: String,
    default: 'general',
    trim: true
  },
  metadata: {
    type: Map,
    of: String
  }
}, { timestamps: true });

module.exports = mongoose.model('PageContent', pageContentSchema);
