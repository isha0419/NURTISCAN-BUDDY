const mongoose = require('mongoose');

const foodEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodName: { type: String, required: true },
  nutrients: {
    calories: Number,
    sugar: Number,
    sodium: Number,
    protein: Number,
  },
  riskCategory: { type: String, default: 'unknown' },
  aiSuggestion: { type: String, default: '' },
  source: { type: String, enum: ['manual', 'ocr', 'ai'], default: 'manual' },
}, { timestamps: true });

module.exports = mongoose.model('FoodEntry', foodEntrySchema);