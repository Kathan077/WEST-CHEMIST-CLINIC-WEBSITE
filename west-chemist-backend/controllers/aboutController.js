const AboutItem = require('../models/AboutItem');

// Helper to seed initial About page data if collection is empty
const seedAboutDataIfEmpty = async () => {
  try {
    const count = await AboutItem.countDocuments();
    if (count === 0) {
      const initialItems = [
        // Hero
        {
          type: 'hero',
          title: 'About West Chemist',
          content: 'Serving our communities for over 20 years, West Chemist is dedicated to providing high-quality prescription medicines, travel health, and personalized patient care. Our team of experienced pharmacists and professional healthcare staff are here to simplify medication management and support you and your family through all stages of life.'
        },
        // Stats
        {
          type: 'stat',
          title: '15,000+',
          content: 'Prescriptions Dispensed'
        },
        {
          type: 'stat',
          title: '10,000+',
          content: 'Patients Served'
        },

        // Cards (Mission, Vision, Values)
        {
          type: 'card',
          title: 'Mission',
          content: 'To deliver timely prescription dispensing, expert travel health, and accessible pharmacy services through a compassionate, patient-centered team dedicated to your family’s well-being.',
          icon: 'mission'
        },
        {
          type: 'card',
          title: 'Vision',
          content: 'To remain the most trusted community pharmacy partner across every stage of life, empowering patients with expert guidance, reliable care, and total peace of mind.',
          icon: 'vision'
        },
        {
          type: 'card',
          title: 'Our Values',
          content: 'At West Chemist, we are guided by compassion, clinical integrity, and community trust. We know medication management can feel overwhelming, so we treat every patient with warmth, respect, and personalized care.',
          icon: 'values'
        }
      ];
      await AboutItem.insertMany(initialItems);
      console.log('Successfully seeded default about page items.');
    }

    // Seed FAQs if none exist
    const faqCount = await AboutItem.countDocuments({ type: 'faq' });
    if (faqCount === 0) {
      const defaultFaqs = [
        {
          type: 'faq',
          title: "How do I book an appointment online?",
          content: "You can easily book an appointment through our online patient portal by selecting your required pharmacy service and preferred time slot."
        },
        {
          type: 'faq',
          title: "Can I access my booking records digitally?",
          content: "Yes, all patients can securely access their appointment history, consultation notes, and booking details through our online patient portal."
        },
        {
          type: 'faq',
          title: "What pharmacy services do you offer?",
          content: "We offer NHS & private prescription dispensing, travel health consultations & vaccinations, weight management treatments, ear wax removal, and health checks."
        },
        {
          type: 'faq',
          title: "Are online consultations available?",
          content: "Yes, we offer secure online consultations for non-emergency health advice and follow-ups with our qualified pharmacists."
        },
        {
          type: 'faq',
          title: "How secure is my personal health data?",
          content: "Your privacy is our priority. We use industry-standard encryption and fully comply with GDPR regulations to ensure your data is safe."
        },
        {
          type: 'faq',
          title: "What if I need to reschedule or cancel my appointment?",
          content: "You can reschedule or cancel your appointment via the patient portal or by calling our pharmacy directly at least 24 hours in advance."
        }
      ];
      await AboutItem.insertMany(defaultFaqs);
      console.log('Successfully seeded default about FAQs.');
    }

    // Seed Branches if none exist
    const branchCount = await AboutItem.countDocuments({ type: 'branch' });
    if (branchCount === 0) {
      const defaultBranches = [
        {
          type: 'branch',
          title: 'Northampton Pharmacy',
          content: 'Our primary community pharmacy hub offering comprehensive prescription dispensing, travel vaccinations, and expert health advice.',
          icon: '📍',
          metadata: {
            address: '4 Kingsley Park Terrace, NN2 7HG',
            image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
            badge: 'Flagship Pharmacy',
            stat1_num: 'Daily',
            stat1_label: 'Pharmacy',
            stat2_num: 'Private',
            stat2_label: 'Consult Room',
            stat3_num: '100%',
            stat3_label: 'Quality Care',
            action_url: 'https://maps.google.com/?q=4+Kingsley+Park+Terrace,+Northampton+NN2+7HG,+United+Kingdom',
            action_text: 'View Pharmacy & Directions'
          }
        },
        {
          type: 'branch',
          title: 'East London Consultation Hub',
          content: 'Our dedicated consultation hub offering in-person health assessments, travel vaccinations, and private consultations in East London.',
          icon: '📍',
          metadata: {
            address: 'East London, UK',
            image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
            badge: 'Consultation Hub',
            stat1_num: '7 Days',
            stat1_label: 'Availability',
            stat2_num: 'Private',
            stat2_label: 'Consult Room',
            stat3_num: 'Secure',
            stat3_label: 'Consultations',
            action_url: '/book-appointment',
            action_text: 'Book Consultation'
          }
        }
      ];
      await AboutItem.insertMany(defaultBranches);
      console.log('Successfully seeded default about branches.');
    }

    // Seed Impact if none exists
    const impactCount = await AboutItem.countDocuments({ type: 'impact' });
    if (impactCount === 0) {
      const defaultImpact = {
        type: 'impact',
        title: 'Our Impact in Numbers',
        content: 'At West Chemist, we go beyond dispensing medicines to provide dedicated community healthcare.',
        icon: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=90',
        metadata: {
          stat1_num: '15',
          stat1_label: 'Years of Excellence',
          stat1_suffix: '+',
          stat2_num: '10',
          stat2_label: 'Qualified Pharmacists & Staff',
          stat2_suffix: '+',
          stat3_num: '99',
          stat3_label: 'Patient Satisfaction',
          stat3_suffix: '%',
          stat4_num: '2000',
          stat4_label: 'Happy Clients',
          stat4_suffix: '+'
        }
      };
      await AboutItem.create(defaultImpact);
      console.log('Successfully seeded default about impact section.');
    }
  } catch (error) {
    console.error('Error seeding initial about data:', error);
  }
};

// @desc    Get all about page items
// @route   GET /api/about
// @access  Public
const getAboutItems = async (req, res) => {
  try {
    // Migration helper to auto-clean outdated DB content (surgeries/specialists/clinic branding)
    // Delete the outdated "Vaccinations Administered" and "Years Experience" stats if they exist
    await AboutItem.deleteMany({ content: 'Vaccinations Administered' });
    await AboutItem.deleteMany({ content: 'Years Experience' });
    await AboutItem.updateMany(
      { content: 'Specialists' },
      { $set: { title: '10,000+', content: 'Patients Served' } }
    );
    await AboutItem.updateMany(
      { type: 'hero' },
      { $set: { title: 'About West Chemist', content: 'Serving our communities for over 20 years, West Chemist is dedicated to providing high-quality prescription medicines, travel health, and personalized patient care. Our team of experienced pharmacists and professional healthcare staff are here to simplify medication management and support you and your family through all stages of life.' } }
    );
    await AboutItem.updateMany(
      { type: 'card', title: 'Mission' },
      { $set: { content: 'To deliver timely prescription dispensing, expert travel health, and accessible pharmacy services through a compassionate, patient-centered team dedicated to your family’s well-being.' } }
    );
    await AboutItem.updateMany(
      { type: 'card', title: 'Vision' },
      { $set: { content: 'To remain the most trusted community pharmacy partner across every stage of life, empowering patients with expert guidance, reliable care, and total peace of mind.' } }
    );
    await AboutItem.updateMany(
      { type: 'card', title: 'Our Values' },
      { $set: { content: 'At West Chemist, we are guided by compassion, clinical integrity, and community trust. We know medication management can feel overwhelming, so we treat every patient with warmth, respect, and personalized care.' } }
    );
    await AboutItem.updateMany(
      { 'metadata.stat2_label': 'Certified Doctors & Specialists' },
      { $set: { 'metadata.stat2_label': 'Qualified Pharmacists & Staff' } }
    );
    await AboutItem.updateMany(
      { title: { $in: ['UK Online Virtual Clinic', 'UK Online Virtual Pharmacy', 'West Chemist — Online Virtual Clinic'] } },
      { $set: { title: 'East London Consultation Hub', content: 'Our dedicated consultation hub offering in-person health assessments, travel vaccinations, and private consultations in East London.', 'metadata.address': 'East London, UK', 'metadata.badge': 'Consultation Hub' } }
    );

    const items = await AboutItem.find();
    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching about items',
      error: error.message
    });
  }
};

// @desc    Create a new about item
// @route   POST /api/about
// @access  Private/Admin
const createAboutItem = async (req, res) => {
  try {
    const { type, title, content, icon, metadata } = req.body;
    
    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Item type is required'
      });
    }

    const newItem = await AboutItem.create({
      type,
      title: title ? title.trim() : '',
      content: content ? content.trim() : '',
      icon: icon || '',
      metadata: metadata || {}
    });

    res.status(201).json({
      success: true,
      message: 'About item created successfully',
      data: newItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating about item',
      error: error.message
    });
  }
};

// @desc    Update about item by ID
// @route   PUT /api/about/:id
// @access  Private/Admin
const updateAboutItem = async (req, res) => {
  try {
    const { title, content, icon, metadata } = req.body;
    
    let item = await AboutItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'About item not found'
      });
    }

    if (typeof title !== 'undefined') item.title = title.trim();
    if (typeof content !== 'undefined') item.content = content.trim();
    if (typeof icon !== 'undefined') item.icon = icon;
    if (typeof metadata !== 'undefined') item.metadata = metadata;

    await item.save();

    res.status(200).json({
      success: true,
      message: 'About item updated successfully',
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating about item',
      error: error.message
    });
  }
};

// @desc    Delete about item by ID
// @route   DELETE /api/about/:id
// @access  Private/Admin
const deleteAboutItem = async (req, res) => {
  try {
    const item = await AboutItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'About item not found'
      });
    }

    // Don't allow deleting the hero item easily (or keep at least one hero)
    if (item.type === 'hero') {
      const heroCount = await AboutItem.countDocuments({ type: 'hero' });
      if (heroCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the only hero section'
        });
      }
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: 'About item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting about item',
      error: error.message
    });
  }
};

module.exports = {
  getAboutItems,
  createAboutItem,
  updateAboutItem,
  deleteAboutItem
};
