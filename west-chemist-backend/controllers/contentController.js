const PageContent = require('../models/PageContent');

// @desc    Get all page contents
// @route   GET /api/contents
// @access  Public
const getAllContents = async (req, res) => {
  try {
    const contents = await PageContent.find();
    res.status(200).json({
      success: true,
      count: contents.length,
      data: contents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching page contents',
      error: error.message
    });
  }
};

// @desc    Get page content by key
// @route   GET /api/contents/:key
// @access  Public
const getContentByKey = async (req, res) => {
  try {
    const key = req.params.key.toLowerCase().trim();
    const alternativeKey = key.replace(/_/g, '-');
    let content = await PageContent.findOne({
      $or: [
        { key: key },
        { key: alternativeKey }
      ]
    });
    if (!content) {
      if (key === 'clinic-hours') {
        content = await PageContent.create({
          key: 'clinic-hours',
          title: 'West Chemist Opening Hours',
          content: 'Monday - Friday: 9:00 AM - 5:30 PM, Saturday: 9:00 AM - 1:00 PM, Sunday: Closed',
          section: 'general',
          metadata: {
            mon_fri: '9:00 AM - 5:30 PM',
            sat: '9:00 AM - 1:00 PM',
            sun: 'Closed'
          }
        });
      } else if (key === 'clinic-holidays') {
        content = await PageContent.create({
          key: 'clinic-holidays',
          title: 'Clinic Blocked Holidays',
          content: '',
          section: 'settings',
          metadata: {}
        });
      } else if (key === 'clinic-schedule') {
        content = await PageContent.create({
          key: 'clinic-schedule',
          title: 'Clinic Time Slots Schedule',
          content: JSON.stringify({
            defaultSlots: [
              "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
              "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM",
              "02:00 PM", "02:30 PM", "03:00 PM", "04:00 PM",
              "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM"
            ],
            customDates: {}
          }),
          section: 'settings',
          metadata: {}
        });
      } else if (key === 'health-tools-header') {
        content = await PageContent.create({
          key: 'health-tools-header',
          title: 'Interactive Health Tools',
          content: 'Free tools to help you monitor and understand your wellbeing.',
          section: 'general',
          metadata: {}
        });
      } else if (key === 'health-tools-list') {
        content = await PageContent.create({
          key: 'health-tools-list',
          title: 'Interactive Health Tools List',
          content: JSON.stringify([
            { title: "BMI Calculator", icon: "calculator", desc: "Check your Body Mass Index in seconds." },
            { title: "Diabetes Risk", icon: "droplet", desc: "Take a simple test to assess your risk factor." },
            { title: "Heart Age", icon: "heart", desc: "Evaluate your cardiovascular health profile." },
            { title: "Symptom Checker", icon: "search", desc: "Get instant guidance on common symptoms." }
          ]),
          section: 'general',
          metadata: {}
        });
      } else if (key === 'social-feed-header') {
        content = await PageContent.create({
          key: 'social-feed-header',
          title: 'Health Tips on Social',
          content: 'Follow us @westchemistclinic for daily medical insights.',
          section: 'general',
          metadata: {
            instagram_url: 'https://instagram.com/westchemistclinic'
          }
        });
      } else {
        return res.status(404).json({
          success: false,
          message: `Content with key '${req.params.key}' not found`
        });
      }
    }
    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching content details',
      error: error.message
    });
  }
};

// @desc    Update or create page content by key
// @route   PUT /api/contents/:key
// @access  Private/Admin
const updateContentByKey = async (req, res) => {
  try {
    const { key } = req.params;
    const alternativeKey = key.toLowerCase().trim().replace(/_/g, '-');
    const { title, content, section, metadata } = req.body;

    let pageContent = await PageContent.findOne({
      $or: [
        { key: key.toLowerCase().trim() },
        { key: alternativeKey }
      ]
    });
    
    if (pageContent) {
      // Update existing content
      if (typeof title !== 'undefined') pageContent.title = title.trim();
      if (typeof content !== 'undefined') pageContent.content = content.trim();
      if (typeof section !== 'undefined') pageContent.section = section.trim();
      if (typeof metadata !== 'undefined') pageContent.metadata = metadata;
      
      await pageContent.save();
    } else {
      // Create new content block
      pageContent = await PageContent.create({
        key: key.toLowerCase().trim(),
        title: title ? title.trim() : '',
        content: content ? content.trim() : '',
        section: section ? section.trim() : 'general',
        metadata: metadata || {}
      });
    }

    res.status(200).json({
      success: true,
      message: 'Page content successfully saved',
      data: pageContent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error saving page content',
      error: error.message
    });
  }
};

module.exports = {
  getAllContents,
  getContentByKey,
  updateContentByKey
};
