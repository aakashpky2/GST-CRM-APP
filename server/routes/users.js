const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Hierarchy routes
router.get('/', protect, userController.getUsers);
router.post('/', protect, userController.createUser);
router.delete('/:id', protect, userController.deleteUser);

// Profile routes
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);

// Settings routes
router.get('/settings', protect, userController.getSettings);
router.put('/settings', protect, userController.updateSettings);

// Learning statistics
router.get('/learning-statistics', protect, userController.getLearningStatistics);

module.exports = router;
