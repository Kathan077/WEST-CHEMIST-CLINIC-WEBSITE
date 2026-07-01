const Category = require('../models/Category');
const Service = require('../models/Service');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 });
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching categories',
      error: error.message
    });
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide category name'
      });
    }

    const trimmedName = name.trim();
    const slug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const exists = await Category.findOne({ $or: [{ name: trimmedName }, { slug }] });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'A category with this name or slug already exists'
      });
    }

    const category = await Category.create({
      name: trimmedName,
      slug
    });

    res.status(201).json({
      success: true,
      message: 'Category successfully created',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating category',
      error: error.message
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if any service is using this category
    const servicesCount = await Service.countDocuments({ cat: category.name });
    if (servicesCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It is currently in use by ${servicesCount} service(s).`
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Category successfully deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting category',
      error: error.message
    });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  deleteCategory
};
