const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Models
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
