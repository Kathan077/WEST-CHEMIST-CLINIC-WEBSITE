const Service = require('../models/Service');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching services',
      error: error.message
    });
  }
};

// @desc    Get service by slug
// @route   GET /api/services/:slug
// @access  Public
const getServiceBySlug = async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug });
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching service details',
      error: error.message
    });
  }
};

const slugify = (text) => (text || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

// @desc    Create new service
// @route   POST /api/services
// @access  Private/Admin
const createService = async (req, res) => {
  try {
    const { slug, title, cat, parentCategory, img, desc, duration, features, color, onHome } = req.body;

    if (!title || !img || !desc || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, img, desc, duration'
      });
    }

    let finalSlug = (slug ? slugify(slug) : slugify(title)).trim();
    if (!finalSlug) finalSlug = `service-${Date.now()}`;

    const finalCat = (cat ? cat.trim() : (parentCategory ? parentCategory.trim() : title.trim()));
    const finalParent = parentCategory ? parentCategory.trim() : 'Private Services';

    let exists = await Service.findOne({ slug: finalSlug });
    if (exists) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const service = await Service.create({
      slug: finalSlug,
      title: title.trim(),
      cat: finalCat,
      parentCategory: finalParent,
      img: img.trim(),
      desc: desc.trim(),
      duration: duration.trim(),
      features: features || [],
      color: color || '#4B2D71',
      onHome: !!onHome
    });

    res.status(201).json({
      success: true,
      message: 'Service successfully created',
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating service',
      error: error.message
    });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = async (req, res) => {
  try {
    const { slug, title, cat, parentCategory, img, desc, duration, features, color, onHome } = req.body;

    let service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    if (title) {
      service.title = title.trim();
      if (!slug) {
        service.slug = slugify(title);
      }
    }

    if (slug) {
      const cleanSlug = slugify(slug);
      if (cleanSlug !== service.slug) {
        const exists = await Service.findOne({ slug: cleanSlug });
        if (exists && exists._id.toString() !== req.params.id) {
          service.slug = `${cleanSlug}-${Date.now().toString().slice(-4)}`;
        } else {
          service.slug = cleanSlug;
        }
      }
    }

    if (cat) service.cat = cat.trim();
    else if (parentCategory) service.cat = parentCategory.trim();

    if (parentCategory) service.parentCategory = parentCategory.trim();
    if (img) service.img = img.trim();
    if (desc) service.desc = desc.trim();
    if (duration) service.duration = duration.trim();
    if (features) service.features = features;
    if (color) service.color = color;
    if (typeof onHome !== 'undefined') service.onHome = !!onHome;

    await service.save();

    res.status(200).json({
      success: true,
      message: 'Service successfully updated',
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating service',
      error: error.message
    });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Service successfully deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting service',
      error: error.message
    });
  }
};

module.exports = {
  getAllServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService
};
