import React, { useState, useEffect } from 'react';
import { 
  fetchOrdersByBuyer, 
  fetchOrdersBySeller, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../utils/api';

const CATEGORY_PRESETS = {
  Electronics: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
  Fashion: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
  Home: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=400&h=400&fit=crop',
  Sports: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=400&fit=crop'
};

const ProfilePage = ({ user, products, fetchProducts, setCurrentPage, setSelectedProduct }) => {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'listings' | 'sales'
  const [orders, setOrders] = useState([]);
  const [sales, setSales] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingSales, setLoadingSales] = useState(false);

  // Add Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    originalPrice: '',
    stock: '10',
    description: '',
    features: '',
    image: '',
    usePreset: true
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Editing Stock States
  const [editingStockId, setEditingStockId] = useState(null);
  const [editStockValue, setEditStockValue] = useState('');

  // Expanded Orders state
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    if (user) {
      loadBuyerOrders();
      loadSellerSales();
    }
  }, [user]);

  const loadBuyerOrders = async () => {
    setLoadingOrders(true);
    const data = await fetchOrdersByBuyer(user.username);
    setOrders(data);
    setLoadingOrders(false);
  };

  const loadSellerSales = async () => {
    setLoadingSales(true);
    const data = await fetchOrdersBySeller(user.username);
    setSales(data);
    setLoadingSales(false);
  };

  // Filter products to show only listings belonging to this seller
  const myListings = products.filter(p => p.seller === user.username);

  // Compute overall stats
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const totalEarned = sales.reduce((sum, o) => sum + (o.sellerEarnings || 0), 0);

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setFormLoading(true);

    const imageUrl = newProduct.usePreset 
      ? (CATEGORY_PRESETS[newProduct.category] || CATEGORY_PRESETS.Electronics)
      : newProduct.image;

    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      setFormError('Product Name, Price, and Stock are required fields.');
      setFormLoading(false);
      return;
    }

    try {
      const productData = {
        name: newProduct.name,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        originalPrice: parseFloat(newProduct.originalPrice) || parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        description: newProduct.description,
        features: newProduct.features,
        image: imageUrl,
        seller: user.username
      };

      await createProduct(productData);
      setFormSuccess('Product listed successfully in the marketplace!');
      setNewProduct({
        name: '',
        category: 'Electronics',
        price: '',
        originalPrice: '',
        stock: '10',
        description: '',
        features: '',
        image: '',
        usePreset: true
      });
      fetchProducts(); // Refresh main product listing
    } catch (err) {
      setFormError(err.message || 'Failed to list product. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleStockUpdate = async (productNumId) => {
    try {
      const updatedValue = parseInt(editStockValue);
      if (isNaN(updatedValue) || updatedValue < 0) {
        alert('Please enter a valid stock quantity.');
        return;
      }
      await updateProduct(productNumId, { stock: updatedValue, seller: user.username });
      setEditingStockId(null);
      setEditStockValue('');
      fetchProducts(); // Refresh products in parent context
    } catch (err) {
      alert(err.message || 'Failed to update stock.');
    }
  };

  const handleDeleteListing = async (productNumId) => {
    if (!window.confirm('Are you sure you want to remove this product listing from the shop?')) {
      return;
    }
    try {
      await deleteProduct(productNumId, user.username);
      fetchProducts();
    } catch (err) {
      alert(err.message || 'Failed to delete product.');
    }
  };

  if (!user) {
    return (
      <div className="profile-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: '4rem', color: 'var(--accent)', marginBottom: '20px' }}>
          <i className="fa-solid fa-user-lock"></i>
        </div>
        <h2>Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Please login or sign up to view your profile dashboard.</p>
        <button className="btn-primary" onClick={() => setCurrentPage('auth')}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Profile Header Grid */}
      <div className="profile-header-card">
        <div className="profile-user-info">
          <div className="profile-avatar">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="profile-meta">
            <h2>{user.username}</h2>
            <p className="email-text"><i className="fa-solid fa-envelope"></i> {user.email}</p>
            <p className="role-badge"><i className="fa-solid fa-circle-check"></i> Registered Account</p>
          </div>
        </div>

        <div className="profile-stats-grid">
          <div className="stat-box">
            <span className="stat-num">{orders.length}</span>
            <span className="stat-label">Orders Placed</span>
          </div>
          <div className="stat-box">
            <span className="stat-num">${totalSpent.toFixed(2)}</span>
            <span className="stat-label">Total Spent</span>
          </div>
          <div className="stat-box">
            <span className="stat-num">{myListings.length}</span>
            <span className="stat-label">Active Listings</span>
          </div>
          <div className="stat-box">
            <span className="stat-num glow-earned">${totalEarned.toFixed(2)}</span>
            <span className="stat-label">Shop Earnings</span>
          </div>
        </div>
      </div>

      {/* Dashboard Section */}
      <div className="dashboard-layout">
        {/* Navigation Tabs */}
        <div className="dashboard-tabs">
          <button 
            className={`dash-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <i className="fa-solid fa-bag-shopping"></i> Buying History
          </button>
          <button 
            className={`dash-tab-btn ${activeTab === 'listings' ? 'active' : ''}`}
            onClick={() => setActiveTab('listings')}
          >
            <i className="fa-solid fa-store"></i> Seller Dashboard
          </button>
          <button 
            className={`dash-tab-btn ${activeTab === 'sales' ? 'active' : ''}`}
            onClick={() => setActiveTab('sales')}
          >
            <i className="fa-solid fa-chart-line"></i> Sales Log
          </button>
        </div>

        {/* Tab Contents */}
        <div className="dashboard-content">
          {activeTab === 'orders' && (
            <div className="orders-tab-view">
              <h3>Your Purchase History</h3>
              {loadingOrders ? (
                <div className="dash-loading"><i className="fa-solid fa-spinner fa-spin"></i> Loading purchases...</div>
              ) : orders.length === 0 ? (
                <div className="empty-dash-state">
                  <i className="fa-solid fa-receipt"></i>
                  <p>You haven't bought anything yet.</p>
                  <button className="btn-outline" onClick={() => setCurrentPage('products')}>Start Shopping</button>
                </div>
              ) : (
                <div className="orders-accordion">
                  {orders.map(order => {
                    const isExpanded = expandedOrderId === order._id;
                    const dateFormatted = new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    });
                    
                    return (
                      <div key={order._id} className={`order-card-accordion ${isExpanded ? 'open' : ''}`}>
                        <div className="order-summary-row" onClick={() => setExpandedOrderId(isExpanded ? null : order._id)}>
                          <div className="order-id-group">
                            <span className="order-tag">Order ID</span>
                            <span className="order-hash">#{order._id.substring(18).toUpperCase()}</span>
                          </div>
                          <div>
                            <span className="order-tag">Date</span>
                            <span className="order-val">{dateFormatted}</span>
                          </div>
                          <div>
                            <span className="order-tag">Total</span>
                            <span className="order-val">${order.total.toFixed(2)}</span>
                          </div>
                          <div className="order-status-badge">
                            <span className="status-indicator processing">{order.status}</span>
                            <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="order-details-accordion">
                            <div className="order-items-table">
                              {order.items.map(item => (
                                <div key={item.id} className="order-item-detail-row">
                                  <img src={item.image} alt={item.name} className="order-item-thumb" />
                                  <div className="order-item-desc">
                                    <h4>{item.name}</h4>
                                    <span>Sold by: {item.seller}</span>
                                  </div>
                                  <div className="order-item-pricing">
                                    <span>${item.price.toFixed(2)} × {item.quantity}</span>
                                    <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="order-bill-breakdown">
                              <div className="bill-row"><span>Subtotal:</span><span>${order.subtotal.toFixed(2)}</span></div>
                              {order.discount > 0 && <div className="bill-row savings"><span>Discount Applied:</span><span>-${order.discount.toFixed(2)}</span></div>}
                              <div className="bill-row"><span>Shipping:</span><span>{order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}</span></div>
                              <div className="bill-divider"></div>
                              <div className="bill-row final-total"><span>Grand Total:</span><span>${order.total.toFixed(2)}</span></div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'listings' && (
            <div className="seller-tab-view">
              <div className="seller-dashboard-grid">
                {/* Product Creation Form */}
                <div className="add-product-card">
                  <h3>List a New Product</h3>
                  <form onSubmit={handleAddProductSubmit} className="add-product-form">
                    {formError && <div className="alert-error"><i className="fa-solid fa-triangle-exclamation"></i> {formError}</div>}
                    {formSuccess && <div className="alert-success"><i className="fa-solid fa-check"></i> {formSuccess}</div>}
                    
                    <div className="form-group">
                      <label>Product Name*</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Mechanical Gaming Keyboard" 
                        value={newProduct.name}
                        onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                        required
                      />
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label>Category*</label>
                        <select 
                          value={newProduct.category}
                          onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                        >
                          <option value="Electronics">Electronics</option>
                          <option value="Fashion">Fashion</option>
                          <option value="Home">Home & Kitchen</option>
                          <option value="Sports">Sports & Fitness</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Initial Stock*</label>
                        <input 
                          type="number" 
                          placeholder="10" 
                          min="1"
                          value={newProduct.stock}
                          onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label>Price ($)*</label>
                        <input 
                          type="number" 
                          step="0.01" 
                          placeholder="49.99" 
                          value={newProduct.price}
                          onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Original Price ($)</label>
                        <input 
                          type="number" 
                          step="0.01" 
                          placeholder="79.99 (Optional)" 
                          value={newProduct.originalPrice}
                          onChange={e => setNewProduct({...newProduct, originalPrice: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Product Description</label>
                      <textarea 
                        rows="3" 
                        placeholder="Brief summary of product features, specifications, and details..."
                        value={newProduct.description}
                        onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                      />
                    </div>

                    <div className="form-group">
                      <label>Key Features (comma-separated list)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. RGB Backlit, Red Switches, Detachable Cable"
                        value={newProduct.features}
                        onChange={e => setNewProduct({...newProduct, features: e.target.value})}
                      />
                    </div>

                    {/* Image Source Selection */}
                    <div className="form-group image-select-group">
                      <label>Product Image Source</label>
                      <div className="toggle-preset-buttons">
                        <button 
                          type="button" 
                          className={`toggle-btn ${newProduct.usePreset ? 'active' : ''}`}
                          onClick={() => setNewProduct({...newProduct, usePreset: true})}
                        >
                          Use Category Preset
                        </button>
                        <button 
                          type="button" 
                          className={`toggle-btn ${!newProduct.usePreset ? 'active' : ''}`}
                          onClick={() => setNewProduct({...newProduct, usePreset: false})}
                        >
                          Custom Image URL
                        </button>
                      </div>
                      
                      {newProduct.usePreset ? (
                        <div className="preset-preview-box">
                          <img src={CATEGORY_PRESETS[newProduct.category] || CATEGORY_PRESETS.Electronics} alt="Category Preset" className="preset-thumbnail" />
                          <span className="preset-text-info">Will use default high-quality photo for {newProduct.category} category.</span>
                        </div>
                      ) : (
                        <input 
                          type="url" 
                          placeholder="Paste image address (https://...)" 
                          value={newProduct.image}
                          onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                        />
                      )}
                    </div>

                    <button 
                      type="submit" 
                      className="btn-primary form-submit-btn"
                      disabled={formLoading}
                    >
                      {formLoading ? <><i className="fa-solid fa-spinner fa-spin"></i> Creating...</> : 'Publish Product Listing'}
                    </button>
                  </form>
                </div>

                {/* Seller's Active Listings */}
                <div className="active-listings-card">
                  <h3>Your Active Store Listings</h3>
                  {myListings.length === 0 ? (
                    <div className="empty-listing-box">
                      <i className="fa-solid fa-box-open"></i>
                      <p>You have no products listed for sale yet. Fill out the form to start marketing!</p>
                    </div>
                  ) : (
                    <div className="my-listings-list">
                      {myListings.map(product => {
                        const isEditingThis = editingStockId === product.id;
                        return (
                          <div key={product.id} className="my-listing-row">
                            <img src={product.image} alt={product.name} className="listing-thumb" />
                            <div className="listing-info" onClick={() => { setSelectedProduct(product); setCurrentPage('product-detail'); }} style={{ cursor: 'pointer' }}>
                              <h4>{product.name}</h4>
                              <span className="listing-cat-badge">{product.category}</span>
                              <span className="listing-price">${product.price.toFixed(2)}</span>
                            </div>

                            <div className="listing-stock-actions">
                              {isEditingThis ? (
                                <div className="stock-edit-wrapper">
                                  <input 
                                    type="number" 
                                    className="stock-inline-input"
                                    value={editStockValue}
                                    onChange={e => setEditStockValue(e.target.value)}
                                    min="0"
                                    autoFocus
                                  />
                                  <button className="stock-save-btn" onClick={() => handleStockUpdate(product.id)}>
                                    Save
                                  </button>
                                  <button className="stock-cancel-btn" onClick={() => setEditingStockId(null)}>
                                    ×
                                  </button>
                                </div>
                              ) : (
                                <div className="stock-display-wrapper">
                                  <span className={`stock-count-indicator ${product.stock <= 3 ? 'low-stock' : ''}`}>
                                    Stock: <strong>{product.stock}</strong>
                                  </span>
                                  <button 
                                    className="stock-edit-trigger" 
                                    onClick={() => {
                                      setEditingStockId(product.id);
                                      setEditStockValue(product.stock.toString());
                                    }}
                                    title="Edit stock"
                                  >
                                    <i className="fa-solid fa-pen-to-square"></i>
                                  </button>
                                </div>
                              )}
                            </div>

                            <button 
                              className="listing-delete-btn" 
                              onClick={() => handleDeleteListing(product.id)}
                              title="Delete listing"
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sales' && (
            <div className="sales-tab-view">
              <h3>Shop Sales Performance Logs</h3>
              <p className="sales-desc">See who bought your listed items and how much you have earned so far.</p>
              
              {loadingSales ? (
                <div className="dash-loading"><i className="fa-solid fa-spinner fa-spin"></i> Loading sales log...</div>
              ) : sales.length === 0 ? (
                <div className="empty-dash-state">
                  <i className="fa-solid fa-chart-bar"></i>
                  <p>No sales recorded yet. Once users purchase your products, they will appear here!</p>
                </div>
              ) : (
                <div className="sales-table-wrapper">
                  <table className="sales-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Product Item</th>
                        <th>Buyer Username</th>
                        <th>Qty Sold</th>
                        <th>Unit Price</th>
                        <th>Earnings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sales.map(order => {
                        const dateFormatted = new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        });

                        return order.items.map(item => (
                          <tr key={`${order._id}-${item.id}`}>
                            <td>{dateFormatted}</td>
                            <td>
                              <div className="sales-prod-cell">
                                <img src={item.image} alt={item.name} className="sales-prod-thumb" />
                                <span>{item.name}</span>
                              </div>
                            </td>
                            <td><span className="sales-buyer-name">@{order.buyer}</span></td>
                            <td>{item.quantity}</td>
                            <td>${item.price.toFixed(2)}</td>
                            <td><strong className="sales-earnings">+${(item.price * item.quantity).toFixed(2)}</strong></td>
                          </tr>
                        ));
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
