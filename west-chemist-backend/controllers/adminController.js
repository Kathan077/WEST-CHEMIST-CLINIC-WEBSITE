const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

/**
 * Seed a default administrator if none exist in the database
 */
const seedDefaultAdmin = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      await Admin.create({
        username: 'admin',
        email: 'admin@westchemist.com',
        password: 'adminpassword123'
      });
      console.log('💎 [Admin Seeding] Default administrator account successfully created:');
      console.log('   📧 Email: admin@westchemist.com');
      console.log('   👤 Username: admin');
      console.log('   🔑 Password: adminpassword123');
    }
  } catch (error) {
    console.error(`⚠️ [Admin Seeding] Failed to seed default admin: ${error.message}`);
  }
};

/**
 * Authenticate Administrator
 * @route POST /api/admin/login
 */
const adminLogin = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username/Email and password are required'
      });
    }

    // Find admin by either username or email
    const trimmedInput = usernameOrEmail.trim();
    const admin = await Admin.findOne({
      $or: [
        { email: trimmedInput.toLowerCase() },
        { username: trimmedInput }
      ]
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username/email or password'
      });
    }

    // Verify password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username/email or password'
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: 'admin' },
      process.env.JWT_SECRET || 'super_secret_west_chemist_key_2026_antigravity',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Admin authenticated successfully',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (error) {
    console.error(`❌ Error in adminLogin: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error during administrator login',
      error: error.message
    });
  }
};

/**
 * Register a new Administrator
 * @route POST /api/admin/signup
 */
const adminSignup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are all required'
      });
    }

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedUsername.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Username must be at least 3 characters long'
      });
    }

    // Basic email format regex check
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if admin with same username or email already exists
    const existingAdmin = await Admin.findOne({
      $or: [
        { email: trimmedEmail },
        { username: trimmedUsername }
      ]
    });

    if (existingAdmin) {
      if (existingAdmin.email === trimmedEmail) {
        return res.status(400).json({
          success: false,
          message: 'An administrator account with this email address already exists'
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Username is already taken. Please choose another username'
      });
    }

    // Create new admin (password will be automatically hashed in AdminSchema pre-save hook)
    const newAdmin = await Admin.create({
      username: trimmedUsername,
      email: trimmedEmail,
      password: password
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: newAdmin._id, username: newAdmin.username, role: 'admin' },
      process.env.JWT_SECRET || 'super_secret_west_chemist_key_2026_antigravity',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      token,
      admin: {
        id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email
      }
    });
  } catch (error) {
    console.error(`❌ Error in adminSignup: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error during administrator registration',
      error: error.message
    });
  }
};

module.exports = {
  seedDefaultAdmin,
  adminLogin,
  adminSignup
};

