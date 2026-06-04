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

module.exports = {
  seedDefaultAdmin,
  adminLogin
};
