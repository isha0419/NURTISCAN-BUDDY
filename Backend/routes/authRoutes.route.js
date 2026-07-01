const express = require('express');
const router = express.Router();
const { signup, login, logout, getMe , updateHealthProfile} = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/health-profile', protect, updateHealthProfile);

module.exports = router;