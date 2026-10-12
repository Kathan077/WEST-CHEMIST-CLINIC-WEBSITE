const mongoose = require('mongoose');

const comparisonRowSchema = new mongoose.Schema({
  parameter: { type: String, default: '' },
  col1: { type: String, default: '' },
  col2: { type: String, default: '' },
  badge1: { type: String, default: '' }, // e.g. 'accent', 'purple', ''
  badge2: { type: String, default: '' }
}, { _id: true });

const stepSchema = new mongoose.Schema({
  stepNumber: { type: String, default: '1' },
  title: { type: String, default: '' },
  desc: { type: String, default: '' }
}, { _id: true });

const faqItemSchema = new mongoose.Schema({
  question: { type: String, default: '' },
  answer: { type: String, default: '' }
}, { _id: true });

const weightLossCMSSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    default: 'main'
  },
  hero: {
    tag: { type: String, default: 'Pharmacy Service' },
    title: { type: String, default: 'PHARMACYly Supervised' },
    highlight: { type: String, default: 'Weight Loss Program' },
    desc: { type: String, default: 'Achieve safe, sustainable weight reduction with next-generation medical treatments under professional PHARMACY supervision. We offer tailored Wegovy and Mounjaro programs designed for your biology.' },
    btn1Text: { type: String, default: 'Book Private Consultation' },
    btn1Url: { type: String, default: '/book-appointment?service=Weight%20Loss%20Clinic' },
    btn2Text: { type: String, default: 'Compare Treatments' },
    btn2Url: { type: String, default: '#comparison' }
  },
  treatmentsHeader: {
    subtitle: { type: String, default: 'PHARMACY Treatments' },
    title: { type: String, default: 'Our Weight Management Options' },
    desc: { type: String, default: 'We provide MHRA-approved medications and comprehensive health coaching to support your metabolic health journey.' }
  },
  comparisonTable: {
    subtitle: { type: String, default: 'Head to Head' },
    title: { type: String, default: 'Mounjaro vs Wegovy Comparison' },
    desc: { type: String, default: 'Compare the features, mechanism, and efficacy of the leading medical weight management treatments.' },
    col1Name: { type: String, default: 'Parameter' },
    col2Name: { type: String, default: 'Mounjaro® (Tirzepatide)' },
    col3Name: { type: String, default: 'Wegovy® (Semaglutide)' },
    rows: [comparisonRowSchema]
  },
  howItWorks: {
    subtitle: { type: String, default: 'Your Journey' },
    title: { type: String, default: 'How Our Weight Loss Program Works' },
    desc: { type: String, default: 'A simple, secure, and pharmacist-led process to help you get started safely.' },
    steps: [stepSchema]
  },
  faqs: {
    subtitle: { type: String, default: 'Support' },
    title: { type: String, default: 'Frequently Asked Questions' },
    desc: { type: String, default: 'Find clear, direct answers about our private weight loss management services.' },
    items: [faqItemSchema]
  },
  cta: {
    eyebrow: { type: String, default: 'Start Today' },
    title: { type: String, default: 'Ready to Begin Your Weight Loss Journey?' },
    desc: { type: String, default: 'Take control of your health. Book an in-person PHARMACY assessment today with our professional team.' },
    btnText: { type: String, default: 'Book Your Consultation Now' },
    btnUrl: { type: String, default: '/book-appointment?service=Weight%20Loss%20Clinic' },
    note: { type: String, default: 'Subject to PHARMACY suitability assessment. Patients must be aged 18 or over.' }
  }
}, { timestamps: true });

module.exports = mongoose.model('WeightLossCMS', weightLossCMSSchema);
