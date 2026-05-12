import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { fetchProducts } from '../utils/api';

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) stars.push('fa-star');
    else if (i - rating < 1) stars.push('fa-star-half-stroke');
    else stars.push('fa-regular fa-star');
  }
  return (
    <div className="stars stars-lg">
      {stars.map((type, idx) => (
        <i key={idx} className={`fa-solid ${type}`} style={{ color: type.includes('regular') ? 'var(--text-muted)' : '#FFD700' }}></i>
      ))}
    </div>
  );
};

const ProductDetailPage = ({ product, setCurrentPage, setSelectedProduct }) => {
  const { addItem, items } = useCart();
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const loadData = async () => {
      if (product) {
        const all = await fetchProducts();
        setRelated(all.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3));
      } else {
        setCurrentPage('products');
      }
    };
    loadData();
  }, [product, setCurrentPage]);

  if (!product) {
    return <div className="loading">Loading product details...</div>;
  }

  const inCart = items.some(i => i.id === product.id);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="detail-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <button onClick={() => setCurrentPage('home')}>Home</button>
        <span>/</span>
        <button onClick={() => setCurrentPage('products')}>Products</button>
        <span>/</span>
        <button onClick={() => setCurrentPage('products')}>{product.category}</button>
        <span>/</span>
        <span className="breadcrumb-current">{product.name}</span>
      </nav>

      {/* Main Detail */}
      <div className="detail-main">
        {/* Image */}
        <div className="detail-image-section">
          <div className="detail-image-wrap">
            <img src={product.image} alt={product.name} className="detail-image" />
            {product.badge && <span className="product-badge">{product.badge}</span>}
            {discount > 0 && <span className="discount-tag">-{discount}%</span>}
          </div>
        </div>

        {/* Info */}
        <div className="detail-info-section">
          <span className="product-category">{product.category}</span>
          <h1 className="detail-title">{product.name}</h1>

          <div className="detail-rating">
            <StarRating rating={product.rating} />
            <span className="rating-num">{product.rating}</span>
            <span className="review-count">({product.reviews.toLocaleString()} reviews)</span>
          </div>

          <div className="detail-pricing">
            <span className="detail-price">${product.price.toFixed(2)}</span>
            <span className="detail-original">${product.originalPrice.toFixed(2)}</span>
            <span className="savings-tag">Save ${(product.originalPrice - product.price).toFixed(2)}</span>
          </div>

          <p className="detail-description">{product.description}</p>

          {/* Features */}
          <div className="detail-features">
            {product.features.map(f => (
              <span key={f} className="feature-pill"><i className="fa-solid fa-check"></i> {f}</span>
            ))}
          </div>

          {/* Quantity + Add to Cart */}
          <div className="detail-actions">
            <div className="qty-control">
              <button
                className="qty-btn"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                id="qty-decrease"
              ><i className="fa-solid fa-minus"></i></button>
              <span className="qty-value">{quantity}</span>
              <button
                className="qty-btn"
                onClick={() => setQuantity(q => q + 1)}
                id="qty-increase"
              ><i className="fa-solid fa-plus"></i></button>
            </div>

            <button
              className={`btn-primary detail-add-btn ${added ? 'added' : ''}`}
              onClick={handleAddToCart}
              id="detail-add-to-cart"
            >
              {added ? (
                <>
                  <i className="fa-solid fa-check"></i> Added to Cart!
                </>
              ) : inCart ? (
                <>
                  <i className="fa-solid fa-plus"></i> Add More
                </>
              ) : (
                <>
                  <i className="fa-solid fa-cart-shopping"></i> Add to Cart
                </>
              )}
            </button>

            <button
              className="btn-outline"
              onClick={() => setCurrentPage('cart')}
              id="detail-view-cart"
            >
              View Cart
            </button>
          </div>

          <div className="detail-meta">
            <span><i className="fa-solid fa-circle-check" style={{ color: 'var(--accent-3)' }}></i> In Stock</span>
            <span><i className="fa-solid fa-truck" style={{ color: 'var(--accent)' }}></i> Free Shipping</span>
            <span><i className="fa-solid fa-rotate-left" style={{ color: 'var(--accent-2)' }}></i> 30-Day Returns</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="detail-tabs">
        <div className="tabs-nav">
          {['description', 'features', 'reviews'].map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
              id={`tab-${tab}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="tab-content">
          {activeTab === 'description' && (
            <div className="tab-pane">
              <h3>About This Product</h3>
              <p>{product.description}</p>
              <p>This product is carefully crafted to meet the highest standards of quality. Whether you're a professional or an enthusiast, it's designed to deliver outstanding performance and value.</p>
            </div>
          )}
          {activeTab === 'features' && (
            <div className="tab-pane">
              <h3>Key Features</h3>
              <ul className="features-list">
                {product.features.map(f => (
                  <li key={f}><span className="check"><i className="fa-solid fa-check"></i></span> {f}</li>
                ))}
              </ul>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="tab-pane">
              <h3>Customer Reviews</h3>
              <div className="reviews-summary">
                <div className="avg-rating">
                  <span className="avg-num">{product.rating}</span>
                  <StarRating rating={product.rating} />
                  <span>{product.reviews.toLocaleString()} reviews</span>
                </div>
              </div>
              {[
                { name: 'Ahmed M.', rating: 5, text: 'Absolutely love this product! Exceeded all my expectations. Build quality is superb.' },
                { name: 'Sara K.', rating: 4, text: 'Great product for the price. Fast delivery and well packaged.' },
                { name: 'Omar T.', rating: 5, text: 'Best purchase I\'ve made this year. Highly recommend to everyone.' },
              ].map((r, i) => (
                <div key={i} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-avatar">{r.name[0]}</div>
                    <div>
                      <strong>{r.name}</strong>
                      <div className="stars">
                        {[...Array(5)].map((_, idx) => (
                          <i key={idx} className={`${idx < r.rating ? 'fa-solid' : 'fa-regular'} fa-star`} style={{ color: '#FFD700' }}></i>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p>{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="related-products">
          <div className="section-header">
            <h2>Related Products</h2>
          </div>
          <div className="products-grid">
            {related.map(p => (
              <div key={p.id} className="product-card" onClick={() => { setSelectedProduct(p); window.scrollTo(0, 0); }}>
                <div className="product-image-wrap">
                  <img src={p.image} alt={p.name} className="product-image" />
                  {p.badge && <span className="product-badge">{p.badge}</span>}
                </div>
                <div className="product-info">
                  <h3 className="product-name">{p.name}</h3>
                  <div className="product-pricing">
                    <span className="product-price">${p.price.toFixed(2)}</span>
                    <span className="product-original-price">${p.originalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
