const express = require('express');
const router = express.Router();
const { analyzeFood , getCravingAlternatives , scanLabelImage } = require('../controllers/aiController');
const protect = require('../middleware/authMiddleware');

router.post('/analyze', protect, analyzeFood);
router.post('/craving', protect, getCravingAlternatives);
router.post('/scan-label', protect, scanLabelImage);

module.exports = router;