const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const STATIC_ADMIN = {
  username: 'kalkihealthltd',
  email: 'kalkihealthltd@gmail.com',
  password: 'kalkihealthltd123'
};

/**
 * Seed a default administrator if none exist in the database
 */
const seedDefaultAdmin = async () => {
  try {
    const existing = await Admin.findOne({
      $or: [
        { email: STATIC_ADMIN.email },
        { username: STATIC_ADMIN.username }
      ]
    });
    if (!existing) {
      await Admin.create({
        username: STATIC_ADMIN.username,
        email: STATIC_ADMIN.email,
        password: STATIC_ADMIN.password
      });
      console.log('💎 [Admin Seeding] Administrator account successfully created:');
      console.log(`   📧 Email: ${STATIC_ADMIN.email}`);
      console.log(`   👤 Username: ${STATIC_ADMIN.username}`);
      console.log(`   🔑 Password: ${STATIC_ADMIN.password}`);
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

    // Check fixed static admin credentials
    if (
      (trimmedInput.toLowerCase() === STATIC_ADMIN.email || trimmedInput.toLowerCase() === STATIC_ADMIN.username) &&
      password === STATIC_ADMIN.password
    ) {
      const token = jwt.sign(
        { id: 'static_admin_kalki', username: STATIC_ADMIN.username, email: STATIC_ADMIN.email, role: 'admin' },
        process.env.JWT_SECRET || 'super_secret_west_chemist_key_2026_antigravity',
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        success: true,
        message: 'Admin authenticated successfully',
        token,
        admin: {
          id: 'static_admin_kalki',
          username: STATIC_ADMIN.username,
          email: STATIC_ADMIN.email
        }
      });
    }

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
  return res.status(403).json({
    success: false,
    message: 'Administrator signup is disabled. Only the designated administrator can access this portal.'
  });
};

module.exports = {
  seedDefaultAdmin,
  adminLogin,
  adminSignup
};

