const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  medicalConditions: { type: [String], default: [] }, // e.g. ["diabetes", "hypertension"]
  allergies: { type: [String], default: [] },
  dietaryPreferences: { type: [String], default: [] }, // e.g. ["vegetarian", "low-sodium"]
  onboardingComplete: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);