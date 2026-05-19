import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../utils/api';

const CartPage = ({ setCurrentPage, user }) => {
  const { items, removeItem, updateQuantity, clearCart, totalPrice, totalItems, savings } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const shipping = totalPrice > 50 ? 0 : 9.99;
  const discount = promoApplied ? totalPrice * 0.1 : 0;
  const finalTotal = totalPrice - discount + shipping;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setPromoApplied(true);
    } else {
      alert('Invalid promo code. Try SAVE10 for 10% off!');
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      alert('Please login to complete your purchase');
      setCurrentPage('auth');
      return;
    }
    setLoading(true);
    try {
      const orderData = {
        buyer: user.username,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          seller: item.seller || 'ShopWave'
        })),
        subtotal: totalPrice,
        shipping,
        discount,
        total: finalTotal
      };
      const res = await createOrder(orderData);
      setCreatedOrder(res.order);
      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      alert(err.message || 'Failed to place order. Please check available stock.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="order-success">
        <div className="success-card">
          <div className="success-icon"><i className="fa-solid fa-circle-check" style={{ color: 'var(--accent-3)' }}></i></div>
          <h1>Order Placed!</h1>
          <p>Thank you for your purchase. Your order has been confirmed and will be delivered soon.</p>
          <div className="success-details">
            <div><span>Order ID</span><strong>#{createdOrder ? createdOrder._id.substring(18).toUpperCase() : 'SW-0000'}</strong></div>
            <div><span>Total Paid</span><strong>${createdOrder ? createdOrder.total.toFixed(2) : finalTotal.toFixed(2)}</strong></div>
            <div><span>Est. Delivery</span><strong>3–5 Business Days</strong></div>
            <div><span>Payment</span><strong>Confirmed ✓</strong></div>
          </div>
          <button className="btn-primary" onClick={() => setCurrentPage('home')} id="continue-shopping-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon"><i className="fa-solid fa-cart-shopping"></i></div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any items yet. Start shopping and fill it up!</p>
        <button className="btn-primary" onClick={() => setCurrentPage('products')} id="empty-cart-shop-btn">
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="page-header">
        <h1>Shopping Cart</h1>
        <p>{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
      </div>

      <div className="cart-layout">
        {/* Cart Items */}
        <div className="cart-items-section">
          <div className="cart-items-header">
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Subtotal</span>
            <span></span>
          </div>

          <div className="cart-items-list">
            {items.map(item => (
              <div key={item.id} className="cart-item" id={`cart-item-${item.id}`}>
                <div className="cart-item-product">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <span className="cart-item-cat">{item.category}</span>
                    <span className="cart-item-instock">
                      {item.stock !== undefined && item.stock <= 5 ? (
                        <span style={{ color: 'var(--accent-2)', fontWeight: '600' }}><i className="fa-solid fa-triangle-exclamation"></i> Only {item.stock} left</span>
                      ) : (
                        <span><i className="fa-solid fa-check"></i> In Stock</span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="cart-item-price">${item.price.toFixed(2)}</div>

                <div className="cart-item-qty">
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    id={`cart-qty-dec-${item.id}`}
                  ><i className="fa-solid fa-minus"></i></button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => {
                      if (item.stock !== undefined && item.quantity >= item.stock) {
                        alert(`Only ${item.stock} items available in stock.`);
                        return;
                      }
                      updateQuantity(item.id, item.quantity + 1);
                    }}
                    id={`cart-qty-inc-${item.id}`}
                    disabled={item.stock !== undefined && item.quantity >= item.stock}
                    style={{ opacity: item.stock !== undefined && item.quantity >= item.stock ? 0.5 : 1 }}
                  ><i className="fa-solid fa-plus"></i></button>
                </div>

                <div className="cart-item-subtotal">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                <button
                  className="cart-remove-btn"
                  onClick={() => removeItem(item.id)}
                  id={`remove-item-${item.id}`}
                  title="Remove item"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            ))}
          </div>

          <div className="cart-actions-bar">
            <button className="btn-outline" onClick={() => setCurrentPage('products')} id="continue-btn">
              <i className="fa-solid fa-arrow-left"></i> Continue Shopping
            </button>
            <button className="clear-cart-btn" onClick={clearCart} id="clear-cart-btn">
              <i className="fa-solid fa-trash-can"></i> Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>

          <div className="summary-rows">
            <div className="summary-row">
              <span>Subtotal ({totalItems} items)</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            {savings > 0 && (
              <div className="summary-row savings">
                <span>You Saved</span>
                <span>-${savings.toFixed(2)}</span>
              </div>
            )}
            {promoApplied && (
              <div className="summary-row promo">
                <span>Promo (SAVE10)</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="free-shipping">FREE</span> : `$${shipping.toFixed(2)}`}</span>
            </div>
            {shipping > 0 && (
              <p className="shipping-hint">Add ${(50 - totalPrice).toFixed(2)} more for free shipping!</p>
            )}
            <div className="summary-divider" />
            <div className="summary-row total">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Promo Code */}
          {!promoApplied && (
            <div className="promo-section">
              <h4>Promo Code</h4>
              <div className="promo-input-wrap">
                <input
                  type="text"
                  placeholder="Enter code (try SAVE10)"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  className="promo-input"
                  id="promo-code-input"
                />
                <button className="promo-apply-btn" onClick={handleApplyPromo} id="apply-promo-btn">
                  Apply
                </button>
              </div>
            </div>
          )}
          {promoApplied && (
            <div className="promo-success"><i className="fa-solid fa-check"></i> Promo code SAVE10 applied — 10% off!</div>
          )}

          <button
            className="checkout-btn"
            onClick={handleCheckout}
            id="checkout-btn"
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {loading ? (
              <>Placing Order <i className="fa-solid fa-spinner fa-spin"></i></>
            ) : (
              <>Proceed to Checkout <i className="fa-solid fa-arrow-right"></i></>
            )}
          </button>

          <div className="secure-badges">
            <span><i className="fa-solid fa-lock"></i> Secure Checkout</span>
            <span><i className="fa-solid fa-credit-card"></i> All Cards Accepted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
