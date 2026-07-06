const express = require('express');
const router = express.Router();
const { getEntries, createEntry, deleteEntry, getStats } = require('../controllers/foodController');
const protect = require('../middleware/authMiddleware');

router.get('/', protect, getEntries);
router.post('/', protect, createEntry);
router.delete('/:id', protect, deleteEntry);
router.get('/stats', protect, getStats);

module.exports = router;