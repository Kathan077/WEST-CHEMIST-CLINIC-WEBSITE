const express = require('express');
const router = express.Router();
const { adminLogin, adminSignup } = require('../controllers/adminController');

// Admin login route
router.post('/login', adminLogin);

// Admin signup / register routes
router.post('/signup', adminSignup);
router.post('/register', adminSignup);

module.exports = router;

