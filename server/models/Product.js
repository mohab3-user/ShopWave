const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  image: { type: String, required: true },
  badge: { type: String },
  description: { type: String },
  features: [{ type: String }],
  stock: { type: Number, default: 15 },
  seller: { type: String, default: 'ShopWave' }
});

module.exports = mongoose.model('Product', productSchema);
