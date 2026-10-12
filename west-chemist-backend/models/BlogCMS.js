const mongoose = require('mongoose');

const BlogCMSSchema = new mongoose.Schema(
  {
    hero: {
      mode: {
        type: String,
        enum: ['custom', 'auto'],
        default: 'custom'
      },
      tag: {
        type: String,
        default: 'TRAVEL HEALTH'
      },
      title: {
        type: String,
        default: '5 Essential Travel Vaccinations for Your Next Adventure'
      },
      description: {
        type: String,
        default: 'Planning an international trip is an exciting venture, but amidst booking flights and packing bags, health preparations are often overlooked. Travel vaccinations are crucial to protecting your health and ensuring a smooth journey.'
      },
      date: {
        type: String,
        default: 'Jul 7, 2026'
      },
      btnText: {
        type: String,
        default: 'Read Featured Article'
      },
      btnLink: {
        type: String,
        default: '/blog/5-essential-travel-vaccinations-for-your-next-adventure'
      },
      image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80'
      },
      verificationTitle: {
        type: String,
        default: 'Medically Verified'
      },
      verificationSubtitle: {
        type: String,
        default: 'By Pharmaceutical Team'
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('BlogCMS', BlogCMSSchema);
