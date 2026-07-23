const express = require('express');
const router = express.Router();
const { login, getMe, updateProfileImage } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile-image', protect, updateProfileImage);

module.exports = router;
