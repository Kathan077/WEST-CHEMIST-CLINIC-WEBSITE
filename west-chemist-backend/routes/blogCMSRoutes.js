const express = require('express');
const router = express.Router();
const {
  getBlogCMS,
  updateBlogCMS
} = require('../controllers/blogCMSController');

router.get('/', getBlogCMS);
router.put('/', updateBlogCMS);

module.exports = router;
