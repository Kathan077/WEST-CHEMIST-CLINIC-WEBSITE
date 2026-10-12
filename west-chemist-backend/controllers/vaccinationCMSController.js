const VaccinationCMS = require('../models/VaccinationCMS');

const DEFAULT_PROCESS_STEPS = [
  {
    number: '01',
    title: 'PHARMACY Consultation',
    description: 'Review your travel itinerary, medical history, and risk factors with our qualified pharmacists to determine the exact vaccines you need.'
  },
  {
    number: '02',
    title: 'Secure Administration',
    description: 'Receive your vaccinations in our sterile, private PHARMACY rooms. We use advanced, painless techniques to ensure maximum comfort.'
  },
  {
    number: '03',
    title: 'Certification & Aftercare',
    description: 'Get immediate official documentation, including Yellow Fever certificates, along with professional advice on managing any minor side effects.'
  }
];

const DEFAULT_FAQ_ITEMS = [
  {
    question: 'When should I book my travel vaccinations?',
    answer: 'We strongly recommend booking your consultation at least 6-8 weeks before your departure. Some vaccines require multiple doses spread across several weeks to build full immunity.'
  },
  {
    question: 'Are your vaccines authentic and approved?',
    answer: 'Absolutely. All our vaccines are strictly sourced from licensed UK medical wholesalers, fully MHRA approved, and administered by highly trained, registered pharmacy professionals.'
  },
  {
    question: 'Do I need a prescription from my GP first?',
    answer: 'No. Our pharmacy operates a fully comprehensive service. Our qualified pharmacists are authorized to pharmacy assess your needs and prescribe the necessary vaccines directly during your consultation.'
  },
  {
    question: 'How does the travel consultation work?',
    answer: 'During your consultation, our qualified pharmacist will review your medical history, immunization records, and travel itinerary to create a personalized travel health plan tailored to your destination.'
  }
];

/**
 * @desc    Get Vaccination CMS data (singleton document)
 * @route   GET /api/vaccination-cms
 * @access  Public
 */
const getVaccinationCMS = async (req, res) => {
  try {
    let cms = await VaccinationCMS.findOne();

    if (!cms) {
      cms = await VaccinationCMS.create({});
    }

    let needsSave = false;

    // Ensure default steps exist if empty
    if (!cms.process?.steps || cms.process.steps.length === 0) {
      cms.process = cms.process || {};
      cms.process.steps = DEFAULT_PROCESS_STEPS;
      needsSave = true;
    }

    // Ensure default FAQs exist if empty
    if (!cms.faqs?.items || cms.faqs.items.length === 0) {
      cms.faqs = cms.faqs || {};
      cms.faqs.items = DEFAULT_FAQ_ITEMS;
      needsSave = true;
    }

    if (needsSave) {
      await cms.save();
    }

    res.status(200).json({
      success: true,
      data: cms
    });
  } catch (error) {
    console.error('Error fetching Vaccination CMS:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve Vaccination CMS data',
      error: error.message
    });
  }
};

/**
 * @desc    Update Vaccination CMS data
 * @route   PUT /api/vaccination-cms
 * @access  Private (Admin)
 */
const updateVaccinationCMS = async (req, res) => {
  try {
    let cms = await VaccinationCMS.findOne();

    if (!cms) {
      cms = new VaccinationCMS({});
    }

    const {
      hero,
      gridHeader,
      process,
      faqs
    } = req.body;

    if (hero) {
      cms.hero = { ...cms.hero?.toObject?.() || cms.hero || {}, ...hero };
    }

    if (gridHeader) {
      cms.gridHeader = { ...cms.gridHeader?.toObject?.() || cms.gridHeader || {}, ...gridHeader };
    }

    if (process) {
      if (process.eyebrow !== undefined) cms.process.eyebrow = process.eyebrow;
      if (process.title !== undefined) cms.process.title = process.title;
      if (process.lead !== undefined) cms.process.lead = process.lead;
      if (Array.isArray(process.steps)) cms.process.steps = process.steps;
    }

    if (faqs) {
      if (faqs.eyebrow !== undefined) cms.faqs.eyebrow = faqs.eyebrow;
      if (faqs.title !== undefined) cms.faqs.title = faqs.title;
      if (faqs.lead !== undefined) cms.faqs.lead = faqs.lead;
      if (Array.isArray(faqs.items)) cms.faqs.items = faqs.items;
    }

    const updated = await cms.save();

    res.status(200).json({
      success: true,
      message: 'Vaccination CMS updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Error updating Vaccination CMS:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update Vaccination CMS content',
      error: error.message
    });
  }
};

module.exports = {
  getVaccinationCMS,
  updateVaccinationCMS
};
