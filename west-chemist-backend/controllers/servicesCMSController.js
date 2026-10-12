const ServicesCMS = require('../models/ServicesCMS');

/**
 * @desc    Get Services CMS data (singleton document)
 * @route   GET /api/services-cms
 * @access  Public
 */
const getServicesCMS = async (req, res) => {
  try {
    let cms = await ServicesCMS.findOne();

    if (!cms) {
      cms = await ServicesCMS.create({});
    }

    // Ensure default items exist if empty
    let needsSave = false;
    if (!cms.benefits?.items || cms.benefits.items.length === 0) {
      cms.benefits = cms.benefits || {};
      cms.benefits.items = [
        {
          title: 'Trained Practitioners',
          desc: 'Our team consists of highly trained healthcare professionals ready to provide expert advice.',
          icon: 'practitioner'
        },
        {
          title: 'Digital Scripts',
          desc: 'Secure and accurate prescription management for reliable medication support.',
          icon: 'script'
        },
        {
          title: 'Private Consultation',
          desc: 'Discuss your health in complete confidence in our dedicated private consultation rooms.',
          icon: 'shield'
        }
      ];
      needsSave = true;
    }

    if (!cms.faqs?.items || cms.faqs.items.length === 0) {
      cms.faqs = cms.faqs || {};
      cms.faqs.items = [
        {
          q: 'Do I need a GP referral for Pharmacy First services?',
          a: 'No, you can walk in or book directly for Pharmacy First conditions. We can assess and treat you without needing to see your GP first.'
        },
        {
          q: 'Are the vaccinations suitable for children?',
          a: 'We offer various vaccinations for adults and children. Please contact us or check individual service details for specific age requirements.'
        },
        {
          q: 'Is the weight loss program medically supervised?',
          a: 'Yes, our weight loss programs are supervised by trained practitioners who will monitor your progress and provide professional guidance.'
        },
        {
          q: 'How long does a typical consultation take?',
          a: 'Most consultations take between 10 to 20 minutes, depending on the complexity of the service and your individual health needs.'
        }
      ];
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
    console.error('Error fetching Services CMS:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve Services CMS data',
      error: error.message
    });
  }
};

/**
 * @desc    Update Services CMS data
 * @route   PUT /api/services-cms
 * @access  Private (Admin)
 */
const updateServicesCMS = async (req, res) => {
  try {
    let cms = await ServicesCMS.findOne();

    if (!cms) {
      cms = new ServicesCMS({});
    }

    const {
      hero,
      sectionHeaders,
      benefits,
      faqs,
      cta
    } = req.body;

    if (hero) {
      cms.hero = { ...cms.hero?.toObject?.() || cms.hero || {}, ...hero };
    }

    if (sectionHeaders) {
      if (sectionHeaders.nhs) {
        cms.sectionHeaders.nhs = { ...cms.sectionHeaders?.nhs?.toObject?.() || cms.sectionHeaders?.nhs || {}, ...sectionHeaders.nhs };
      }
      if (sectionHeaders.privateServices) {
        cms.sectionHeaders.privateServices = { ...cms.sectionHeaders?.privateServices?.toObject?.() || cms.sectionHeaders?.privateServices || {}, ...sectionHeaders.privateServices };
      }
      if (sectionHeaders.travelClinic) {
        cms.sectionHeaders.travelClinic = { ...cms.sectionHeaders?.travelClinic?.toObject?.() || cms.sectionHeaders?.travelClinic || {}, ...sectionHeaders.travelClinic };
      }
    }

    if (benefits) {
      if (benefits.eyebrow !== undefined) cms.benefits.eyebrow = benefits.eyebrow;
      if (benefits.title !== undefined) cms.benefits.title = benefits.title;
      if (benefits.subtitle !== undefined) cms.benefits.subtitle = benefits.subtitle;
      if (Array.isArray(benefits.items)) cms.benefits.items = benefits.items;
    }

    if (faqs) {
      if (faqs.title !== undefined) cms.faqs.title = faqs.title;
      if (faqs.subtitle !== undefined) cms.faqs.subtitle = faqs.subtitle;
      if (Array.isArray(faqs.items)) cms.faqs.items = faqs.items;
    }

    if (cta) {
      cms.cta = { ...cms.cta?.toObject?.() || cms.cta || {}, ...cta };
    }

    const updated = await cms.save();

    res.status(200).json({
      success: true,
      message: 'Services CMS updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Error updating Services CMS:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update Services CMS content',
      error: error.message
    });
  }
};

module.exports = {
  getServicesCMS,
  updateServicesCMS
};
