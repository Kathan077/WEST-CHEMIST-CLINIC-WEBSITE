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
          title: 'About West Chemist Clinic',
          content: 'By providing world-class medical facilities, experts, and innovation — making world-class healthcare accessible.'
        },
        // Stats
        {
          type: 'stat',
          title: '1946+',
          content: 'Patients Helped'
        },
        {
          type: 'stat',
          title: '1451+',
          content: 'Specialists'
        },
        {
          type: 'stat',
          title: '15+',
          content: 'Years Experience'
        },
        {
          type: 'stat',
          title: '1500+',
          content: 'Successful Surgeries'
        },
        // Cards (Mission, Vision, Values)
        {
          type: 'card',
          title: 'Mission',
          content: 'To deliver accessible, high-quality healthcare through expert medical care, innovative solutions, and a patient-first approach that improves lives and promotes healthier communities.',
          icon: 'mission'
        },
        {
          type: 'card',
          title: 'Vision',
          content: 'To become a trusted leader in modern healthcare by delivering exceptional care and transforming the healthcare experience for individuals and families.',
          icon: 'vision'
        },
        {
          type: 'card',
          title: 'Our Values',
          content: 'At West Chemist Clinic, we are guided by the values of compassion, trust, excellence, and integrity, ensuring every patient receives personalized care, respect, and support at every step of their healthcare journey.',
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
          content: "You can easily book an appointment through our online patient portal by selecting your preferred doctor and available time slot."
        },
        {
          type: 'faq',
          title: "Can I access my medical records digitally?",
          content: "Yes, all patients can securely access their medical history, prescriptions, and reports through our online patient portal."
        },
        {
          type: 'faq',
          title: "Do you accept health insurance?",
          content: "We accept most major health insurance plans. Please contact our billing department or check our insurance page for a full list of providers."
        },
        {
          type: 'faq',
          title: "Are online consultations available?",
          content: "Yes, we offer secure telehealth consultations for non-emergency medical advice and follow-ups with our specialists."
        },
        {
          type: 'faq',
          title: "How secure is my medical data?",
          content: "Your privacy is our priority. We use industry-standard encryption and fully comply with HIPAA regulations to ensure your data is safe."
        },
        {
          type: 'faq',
          title: "What if I need to reschedule or cancel my appointment?",
          content: "You can reschedule or cancel your appointment via the patient portal or by calling our clinic directly at least 24 hours in advance."
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
          title: 'Northampton Clinic',
          content: 'Our primary healthcare hub offering comprehensive clinical services, prescriptions, and expert advice in a state-of-the-art facility.',
          icon: '📍',
          metadata: {
            address: '4 Kingsley Park Terrace, NN2 7HG',
            image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
            badge: 'Flagship Branch',
            stat1_num: 'Daily',
            stat1_label: 'Pharmacy',
            stat2_num: '10+',
            stat2_label: 'Consult Rooms',
            stat3_num: '100%',
            stat3_label: 'Quality Care',
            action_url: 'https://maps.google.com/?q=4+Kingsley+Park+Terrace,+Northampton+NN2+7HG,+United+Kingdom',
            action_text: 'View Clinic & Directions'
          }
        },
        {
          type: 'branch',
          title: 'UK Online Virtual Clinic',
          content: 'Consult with our licensed pharmacists and health experts securely via private, high-definition video calls from home.',
          icon: '💻',
          metadata: {
            address: 'Accessible Nationwide',
            image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
            badge: 'Fully Operational',
            stat1_num: '7 Days',
            stat1_label: 'Availability',
            stat2_num: 'Zero',
            stat2_label: 'Travel Needed',
            stat3_num: 'Secure',
            stat3_label: 'Consultations',
            action_url: '/book-appointment',
            action_text: 'Book Online Consultation'
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
        content: 'At West Chemist Clinic, we go beyond treatment.',
        icon: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=90',
        metadata: {
          stat1_num: '15',
          stat1_label: 'Years of Excellence',
          stat1_suffix: '+',
          stat2_num: '50',
          stat2_label: 'Certified Doctors & Specialists',
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
    // await seedAboutDataIfEmpty();

    // Auto-migrate old brain paths disabled to keep admin custom images
    /*
    const oldFlagshipPath = '/brain/a9794728-9bd2-4101-a344-91ef761459ce/clinic_branch_flagship_1777976049702.png';
    const oldVirtualPath = '/brain/a9794728-9bd2-4101-a344-91ef761459ce/clinic_branch_secondary_1777976804540.png';

    const hasOldFlagship = await AboutItem.findOne({ 'metadata.image': oldFlagshipPath });
    const hasOldVirtual = await AboutItem.findOne({ 'metadata.image': oldVirtualPath });

    if (hasOldFlagship || hasOldVirtual) {
      if (hasOldFlagship) {
        hasOldFlagship.metadata.set('image', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800');
        await hasOldFlagship.save();
      }
      if (hasOldVirtual) {
        hasOldVirtual.metadata.set('image', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800');
        await hasOldVirtual.save();
      }
    }

    // Auto-clean any uploaded image icons back to clean default emojis
    const branchesToFix = await AboutItem.find({ type: 'branch' });
    for (const b of branchesToFix) {
      if (b.icon && (b.icon.startsWith('data:') || b.icon.startsWith('http') || b.icon.startsWith('/') || b.icon.includes('.'))) {
        const titleLower = b.title.toLowerCase();
        let defaultIcon = '📍';
        if (titleLower.includes('virtual') || titleLower.includes('online')) {
          defaultIcon = '💻';
        }
        b.icon = defaultIcon;
        await b.save();
      }
    }
    */

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
