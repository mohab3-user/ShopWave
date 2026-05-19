import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

const categories = [
  { name: 'Electronics', icon: 'fa-laptop', count: 4, color: '#6C63FF' },
  { name: 'Fashion', icon: 'fa-shirt', count: 4, color: '#FF6584' },
  { name: 'Home & Kitchen', icon: 'fa-house-chimney-window', count: 4, color: '#43E97B' },
  { name: 'Sports', icon: 'fa-volleyball', count: 4, color: '#F093FB' },
];

const HomePage = ({ setCurrentPage, setSelectedProduct, setFilterCategory, products }) => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    const featuredIds = [1, 5, 9, 13, 3, 8];
    setFeatured(products.filter(p => featuredIds.includes(p.id)));
  }, [products]);
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  const handleCategoryClick = (catName) => {
    setFilterCategory(catName);
    setCurrentPage('products');
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge"><i className="fa-solid fa-fire"></i> New Arrivals Every Week</div>
          <h1 className="hero-title">
            Shop the <span className="gradient-text">Future</span> of
            <br />Online Retail
          </h1>
          <p className="hero-subtitle">
            Discover thousands of premium products with unbeatable prices,
            fast shipping, and a seamless shopping experience.
          </p>
          <div className="hero-actions">
            <button
              className="btn-primary"
              onClick={() => setCurrentPage('products')}
              id="hero-shop-now"
            >
              Shop Now <i className="fa-solid fa-arrow-right"></i>
            </button>
            <button
              className="btn-outline"
              onClick={() => setCurrentPage('about')}
              id="hero-learn-more"
            >
              Learn More
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat"><strong>50K+</strong><span>Products</span></div>
            <div className="stat-divider" />
            <div className="stat"><strong>200K+</strong><span>Happy Customers</span></div>
            <div className="stat-divider" />
            <div className="stat"><strong>4.9★</strong><span>Rating</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card-stack">
            <div className="floating-card card-1">
              <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop" alt="headphones" />
              <div>
                <p>Sony WH-1000XM5</p>
                <strong>$349.99</strong>
              </div>
            </div>
            <div className="floating-card card-2">
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop" alt="shoes" />
              <div>
                <p>Nike Air Max 270</p>
                <strong>$149.99</strong>
              </div>
            </div>
            <div className="floating-card card-3">
              <span className="card-icon"><i className="fa-solid fa-check"></i></span>
              <span>Just Added to Cart!</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="trust-bar">
        {[
          { icon: 'fa-truck-fast', label: 'Free Shipping', sub: 'On orders over $50' },
          { icon: 'fa-shield-halved', label: 'Secure Payment', sub: '100% protected' },
          { icon: 'fa-rotate-left', label: 'Easy Returns', sub: '30-day policy' },
          { icon: 'fa-headset', label: '24/7 Support', sub: 'Always here to help' },
        ].map(b => (
          <div key={b.label} className="trust-item">
            <span className="trust-icon"><i className={`fa-solid ${b.icon}`}></i></span>
            <div>
              <strong>{b.label}</strong>
              <span>{b.sub}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section className="section">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <p>Find exactly what you're looking for</p>
        </div>
        <div className="categories-grid">
          {categories.map(cat => (
            <div
              key={cat.name}
              className="category-card"
              onClick={() => handleCategoryClick(cat.name)}
              id={`cat-${cat.name.replace(/\s/g, '-').toLowerCase()}`}
              style={{ '--cat-color': cat.color }}
            >
              <span className="cat-icon"><i className={`fa-solid ${cat.icon}`}></i></span>
              <h3>{cat.name}</h3>
              <p>{cat.count} Products</p>
              <div className="cat-arrow"><i className="fa-solid fa-arrow-right"></i></div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="section-header">
          <h2>Featured Products</h2>
          <button className="view-all-btn" onClick={() => setCurrentPage('products')}>
            View All <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
        <div className="products-grid">
          {featured.map(p => (
            <ProductCard key={p.id} product={p} onClick={handleProductClick} />
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="promo-banner">
        <div className="promo-content">
          <h2>Summer Sale is Live! <i className="fa-solid fa-party-horn" style={{ color: '#FFD700' }}></i></h2>
          <p>Get up to 40% off on selected items. Limited time offer — don't miss out!</p>
          <button className="btn-primary" onClick={() => setCurrentPage('products')} id="promo-shop-btn">
            Grab the Deal
          </button>
        </div>
        <div className="promo-deco">
          <div className="deco-circle c1" />
          <div className="deco-circle c2" />
          <div className="deco-circle c3" />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
