// Models/christmasWish.js
const mongoose = require('mongoose');

const christmasWishSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  fulfilled: { type: Boolean, default: false },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

const ChristmasWish = mongoose.model('ChristmasWish', christmasWishSchema);

module.exports = ChristmasWish;
