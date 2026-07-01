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
    const content = await PageContent.findOne({ key: req.params.key });
    if (!content) {
      return res.status(404).json({
        success: false,
        message: `Content with key '${req.params.key}' not found`
      });
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
    const { title, content, section, metadata } = req.body;

    let pageContent = await PageContent.findOne({ key });
    
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
