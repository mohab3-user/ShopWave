import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) stars.push('fa-star');
    else if (i - rating < 1) stars.push('fa-star-half-stroke');
    else stars.push('fa-regular fa-star');
  }
  return (
    <div className="stars">
      {stars.map((type, idx) => (
        <i key={idx} className={`fa-solid ${type}`} style={{ color: type.includes('regular') ? 'var(--text-muted)' : '#FFD700' }}></i>
      ))}
    </div>
  );
};

const ProductCard = ({ product, onClick }) => {
  const { addItem, items } = useCart();
  const [adding, setAdding] = useState(false);
  const inCart = items.some(i => i.id === product.id);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    setAdding(true);
    addItem(product);
    setTimeout(() => setAdding(false), 600);
  };

  return (
    <div className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`} onClick={() => onClick(product)} id={`product-card-${product.id}`}>
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
        <div className="product-overlay">
          <button className="quick-view-btn">Quick View</button>
        </div>
        {product.badge && <span className="product-badge">{product.badge}</span>}
        {discount > 0 && <span className="discount-tag">-{discount}%</span>}
        {isOutOfStock && <span className="out-of-stock-tag" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', color: '#ff6584', fontWeight: 'bold', fontSize: '1.1rem' }}>Out of Stock</span>}
      </div>

      <div className="product-info">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="product-category">{product.category}</span>
          {product.seller && product.seller !== 'ShopWave' && (
            <span className="seller-badge" style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: '600' }}>
              <i className="fa-solid fa-store" style={{ marginRight: '4px' }}></i>{product.seller}
            </span>
          )}
        </div>
        <h3 className="product-name">{product.name}</h3>

        <div className="product-rating">
          <StarRating rating={product.rating} />
          <span className="review-count">({product.reviews.toLocaleString()})</span>
        </div>

        <div className="product-pricing">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <span className="product-original-price">${product.originalPrice.toFixed(2)}</span>
        </div>

        <button
          className={`add-to-cart-btn ${inCart ? 'in-cart' : ''} ${adding ? 'adding' : ''} ${isOutOfStock ? 'disabled-btn' : ''}`}
          onClick={handleAddToCart}
          id={`add-cart-${product.id}`}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? (
            <span>Out of Stock</span>
          ) : adding ? (
            <span>✓ Added!</span>
          ) : inCart ? (
            <span>✓ In Cart</span>
          ) : (
            <span>Add to Cart</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
