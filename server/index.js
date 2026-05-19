const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Models
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shopwave';

app.use(cors());
app.use(express.json());

// Database Connection
console.log('Attempting to connect to MongoDB...');
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
})
  .then(() => {
    console.log('✅ Successfully connected to MongoDB Atlas');
    seedProducts();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error details:');
    console.error('Error Name:', err.name);
    console.error('Error Message:', err.message);
    if (err.message.includes('buffering timed out')) {
      console.error('TIP: This usually means your IP is not whitelisted or the password in .env is incorrect.');
    }
  });

// Seed data from JSON if empty
const seedProducts = async () => {
  try {
    // 1. Run migrations for any products already on Atlas that lack stock or seller fields
    await Product.updateMany({ stock: { $exists: false } }, { $set: { stock: 15 } });
    await Product.updateMany({ seller: { $exists: false } }, { $set: { seller: 'ShopWave' } });

    // 2. Seed products if the database is empty
    const count = await Product.countDocuments();
    if (count === 0) {
      const productsPath = path.join(__dirname, 'data', 'products.json');
      const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
      await Product.insertMany(productsData);
      console.log('Products seeded successfully');
    }
  } catch (err) {
    console.error('Error seeding products:', err);
  }
};

// --- API ROUTES ---

// Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: parseInt(req.params.id) });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Auth
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const newUser = new User({ username, email, password }); // In real app, hash password!
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: { username, email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
      res.json({ message: 'Login successful', user: { username: user.username, email: user.email } });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- ORDERS & PURCHASES ---
app.post('/api/orders', async (req, res) => {
  try {
    const { buyer, items, subtotal, shipping, discount, total } = req.body;
    
    // 1. Verify stock of all items in cart first
    for (const item of items) {
      const dbProduct = await Product.findOne({ id: item.id });
      if (!dbProduct) {
        return res.status(404).json({ message: `Product "${item.name}" not found.` });
      }
      if (dbProduct.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for "${item.name}". Available: ${dbProduct.stock}` });
      }
    }
    
    // 2. Decrement stock
    for (const item of items) {
      await Product.updateOne({ id: item.id }, { $inc: { stock: -item.quantity } });
    }
    
    // 3. Save order
    const newOrder = new Order({
      buyer,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        seller: item.seller || 'ShopWave'
      })),
      subtotal,
      shipping,
      discount,
      total
    });
    
    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/orders/buyer/:username', async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.params.username }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/orders/seller/:username', async (req, res) => {
  try {
    const orders = await Order.find({ 'items.seller': req.params.username }).sort({ createdAt: -1 });
    
    // Filter items in each order to only show what belongs to this seller
    const filteredOrders = orders.map(order => {
      const orderObj = order.toObject();
      orderObj.items = orderObj.items.filter(item => item.seller === req.params.username);
      // Calculate earnings from this order
      orderObj.sellerEarnings = orderObj.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return orderObj;
    });
    
    res.json(filteredOrders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- MARKETPLACE PRODUCT MANAGEMENT ---
app.post('/api/products', async (req, res) => {
  try {
    const { name, category, price, originalPrice, stock, image, description, features, seller } = req.body;
    
    // Generate sequential product ID
    const maxProduct = await Product.findOne().sort({ id: -1 });
    const nextId = maxProduct ? maxProduct.id + 1 : 1;
    
    const newProduct = new Product({
      id: nextId,
      name,
      category,
      price: parseFloat(price),
      originalPrice: parseFloat(originalPrice) || parseFloat(price),
      stock: parseInt(stock) || 0,
      image: image || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&h=400&fit=crop',
      description: description || '',
      features: Array.isArray(features) ? features : (features ? features.split(',').map(f => f.trim()) : []),
      seller: seller || 'ShopWave'
    });
    
    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { name, category, price, originalPrice, stock, image, description, features, seller } = req.body;
    
    const product = await Product.findOne({ id: parseInt(req.params.id) });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Authorization check
    if (seller && product.seller !== seller) {
      return res.status(403).json({ message: 'Not authorized to edit this product' });
    }
    
    if (name !== undefined) product.name = name;
    if (category !== undefined) product.category = category;
    if (price !== undefined) product.price = parseFloat(price);
    if (originalPrice !== undefined) product.originalPrice = parseFloat(originalPrice);
    if (stock !== undefined) product.stock = parseInt(stock);
    if (image !== undefined) product.image = image;
    if (description !== undefined) product.description = description;
    if (features !== undefined) {
      product.features = Array.isArray(features) ? features : features.split(',').map(f => f.trim());
    }
    
    await product.save();
    res.json({ message: 'Product updated successfully', product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { seller } = req.query;
    const product = await Product.findOne({ id: parseInt(req.params.id) });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Authorization check
    if (seller && product.seller !== seller) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }
    
    await Product.deleteOne({ id: parseInt(req.params.id) });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- DEPLOYMENT ---
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../build');
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(buildPath, 'index.html'));
    }
  });
}

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
