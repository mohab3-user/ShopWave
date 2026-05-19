const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: { type: String, required: true },
  items: [
    {
      id: { type: Number, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true },
      seller: { type: String, required: true }
    }
  ],
  subtotal: { type: Number, required: true },
  shipping: { type: Number, required: true },
  discount: { type: Number, required: true },
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'Processing' }
});

module.exports = mongoose.model('Order', orderSchema);
