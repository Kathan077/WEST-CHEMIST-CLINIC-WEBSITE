const mongoose = require('mongoose');

const heroSlideSchema = new mongoose.Schema({
  badge: { type: String, default: '' },
  badgeIcon: { type: String, default: 'award' },
  words1: { type: [String], default: [] },
  words2: { type: [String], default: [] },
  desc: { type: String, default: '' },
  cta: { type: String, default: '' },
  ctaUrl: { type: String, default: '' },
  secondaryCta: { type: String, default: '' },
  secondaryCtaUrl: { type: String, default: '' },
  image: { type: String, default: '' },
  fallback: { type: String, default: '' },
  overlay: { type: [String], default: [] }
});

const heroStatSchema = new mongoose.Schema({
  number: { type: String, default: '' },
  label: { type: String, default: '' }
});

const aboutFeatureSchema = new mongoose.Schema({
  icon: { type: String, default: '' },
  title: { type: String, default: '' },
  desc: { type: String, default: '' }
});

const howStepSchema = new mongoose.Schema({
  stepNumber: { type: String, default: '' },
  title: { type: String, default: '' },
  desc: { type: String, default: '' },
  icon: { type: String, default: '' }
});

const testimonialReviewSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  role: { type: String, default: '' },
  text: { type: String, default: '' },
  rating: { type: Number, default: 5 },
  avatar: { type: String, default: '' }
});

const HomepageCMSSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    default: 'main'
  },
  heroSlides: [heroSlideSchema],
  heroStats: [heroStatSchema],
  aboutSection: {
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    desc: { type: String, default: '' },
    image: { type: String, default: '' },
    yearsExperience: { type: String, default: '' },
    experienceLabel: { type: String, default: '' },
    features: [aboutFeatureSchema],
    ctaText: { type: String, default: '' },
    ctaUrl: { type: String, default: '' }
  },
  servicesSection: {
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    desc: { type: String, default: '' }
  },
  howItWorks: {
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    desc: { type: String, default: '' },
    steps: [howStepSchema]
  },
  testimonials: {
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    desc: { type: String, default: '' },
    reviews: [testimonialReviewSchema]
  },
  appointmentCta: {
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    desc: { type: String, default: '' },
    image: { type: String, default: '' },
    ctaText: { type: String, default: '' },
    ctaUrl: { type: String, default: '' }
  },
  footerCta: {
    title: { type: String, default: '' },
    ctaText: { type: String, default: '' },
    ctaUrl: { type: String, default: '' }
  },
  seoSettings: {
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    metaKeywords: { type: String, default: '' },
    canonicalUrl: { type: String, default: '' },
    logoUrl: { type: String, default: '' },
    ogTitle: { type: String, default: '' },
    ogDescription: { type: String, default: '' },
    ogImage: { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.model('HomepageCMS', HomepageCMSSchema);
