const BlogCMS = require('../models/BlogCMS');

/**
 * @desc    Get Blog CMS data (singleton document)
 * @route   GET /api/blogs-cms
 * @access  Public
 */
const getBlogCMS = async (req, res) => {
  try {
    let cms = await BlogCMS.findOne();

    if (!cms) {
      cms = await BlogCMS.create({});
    }

    res.status(200).json({
      success: true,
      data: cms
    });
  } catch (error) {
    console.error('Error fetching Blog CMS:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve Blog CMS data',
      error: error.message
    });
  }
};

/**
 * @desc    Update Blog CMS data
 * @route   PUT /api/blogs-cms
 * @access  Private (Admin)
 */
const updateBlogCMS = async (req, res) => {
  try {
    let cms = await BlogCMS.findOne();

    if (!cms) {
      cms = new BlogCMS({});
    }

    const { hero } = req.body;

    if (hero) {
      cms.hero = { ...cms.hero?.toObject?.() || cms.hero || {}, ...hero };
    }

    const updated = await cms.save();

    res.status(200).json({
      success: true,
      message: 'Blog CMS updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Error updating Blog CMS:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update Blog CMS content',
      error: error.message
    });
  }
};

module.exports = {
  getBlogCMS,
  updateBlogCMS
};
