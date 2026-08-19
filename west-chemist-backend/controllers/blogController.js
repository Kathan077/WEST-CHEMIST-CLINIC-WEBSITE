const Blog = require('../models/Blog');

// Get all blogs
const getAllBlogs = async (req, res) => {
  try {
    // Cleanup: Purge non-health dummy test blogs (e.g. VCX, website navigation headers)
    await Blog.deleteMany({
      $or: [
        { title: { $regex: /^vcx$/i } },
        { title: { $regex: /test|dummy|xyz/i } },
        { description: { $regex: /navigation headers|sub-mark|favicon/i } }
      ]
    });

    // Migration helper: fix any blog with broken/empty images in database
    await Blog.updateMany(
      { $or: [ { images: { $size: 0 } }, { images: "https://images.unsplash.com/photo-1559839734-2b71f1536783?w=800&q=80" } ] },
      { $set: { images: ["https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80"] } }
    );

    const blogs = await Blog.find().sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving blogs',
      error: error.message
    });
  }
};

// Get blog by slug
const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug.toLowerCase() });
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving blog post',
      error: error.message
    });
  }
};

// Create new blog
const createBlog = async (req, res) => {
  try {
    const { title, slug, subject, description, images, date, verificationTitle, verificationSubtitle } = req.body;

    if (!title || !slug || !subject || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title, slug, subject, and description are required fields'
      });
    }

    if (title.trim().length < 3 || subject.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Blog title and category must be valid health topics'
      });
    }

    const trimmedSlug = slug.trim().toLowerCase();

    // Check if slug is unique
    const existingBlog = await Blog.findOne({ slug: trimmedSlug });
    if (existingBlog) {
      return res.status(409).json({
        success: false,
        message: 'A blog with this URL slug already exists. Please choose a unique URL.'
      });
    }

    // High quality medical fallback image if none provided
    const validImages = Array.isArray(images) && images.length > 0 && images[0]
      ? images 
      : ["https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80"];

    const blog = await Blog.create({
      title: title.trim(),
      slug: trimmedSlug,
      subject: subject.trim(),
      description,
      images: validImages,
      verificationTitle: verificationTitle ? verificationTitle.trim() : 'Medically Verified',
      verificationSubtitle: verificationSubtitle ? verificationSubtitle.trim() : 'By Pharmacy Team',
      date: date || new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Blog post successfully created!',
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating blog post',
      error: error.message
    });
  }
};

// Update blog
const updateBlog = async (req, res) => {
  try {
    const { title, slug, subject, description, images, date, verificationTitle, verificationSubtitle } = req.body;
    const blogId = req.params.id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    if (slug) {
      const trimmedSlug = slug.trim().toLowerCase();
      // Check if slug is already taken by another blog
      const existingBlog = await Blog.findOne({ slug: trimmedSlug, _id: { $ne: blogId } });
      if (existingBlog) {
        return res.status(409).json({
          success: false,
          message: 'A blog with this URL slug already exists. Please choose a unique URL.'
        });
      }
      blog.slug = trimmedSlug;
    }

    if (title) blog.title = title.trim();
    if (subject) blog.subject = subject.trim();
    if (description) blog.description = description;
    if (images) blog.images = images;
    if (date) blog.date = date;
    if (verificationTitle !== undefined) blog.verificationTitle = verificationTitle.trim();
    if (verificationSubtitle !== undefined) blog.verificationSubtitle = verificationSubtitle.trim();

    await blog.save();

    res.status(200).json({
      success: true,
      message: 'Blog post successfully updated!',
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating blog post',
      error: error.message
    });
  }
};

// Delete blog
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Blog post successfully deleted!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting blog post',
      error: error.message
    });
  }
};

module.exports = {
  getAllBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog
};

