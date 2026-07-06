const FoodEntry = require('../models/FoodEntry.model');
const mongoose = require('mongoose');

const getEntries = async (req, res) => {
  try {
    const entries = await FoodEntry.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createEntry = async (req, res) => {
  try {
    const { foodName, nutrients, riskCategory, aiSuggestion, source } = req.body;

    const entry = await FoodEntry.create({
      userId: req.user.id,
      foodName,
      nutrients,
      riskCategory,
      aiSuggestion,
      source,
    });

    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteEntry = async (req, res) => {
  try {
    const entry = await FoodEntry.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getStats = async (req, res) => {
  try {
    const stats = await FoodEntry.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: '$riskCategory',
          count: { $sum: 1 },
          avgCalories: { $avg: '$nutrients.calories' },
        },
      },
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getEntries, createEntry, deleteEntry, getStats };