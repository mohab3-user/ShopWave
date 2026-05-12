import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const Navbar = ({ currentPage, setCurrentPage, user, handleLogout }) => {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => setCurrentPage('home')} style={{ cursor: 'pointer' }}>
          <i className="fa-solid fa-bag-shopping" style={{ fontSize: '1.8rem', color: 'var(--accent)' }}></i>
          <span className="logo-text">ShopWave</span>
        </div>

        {/* Desktop Nav Links */}
        <div className="navbar-links">
          <button
            className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentPage('home')}
          >
            <i className="fa-solid fa-house"></i> Home
          </button>
          <button
            className={`nav-link ${currentPage === 'products' ? 'active' : ''}`}
            onClick={() => setCurrentPage('products')}
          >
            <i className="fa-solid fa-boxes-stacked"></i> Products
          </button>
          <button
            className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
            onClick={() => setCurrentPage('about')}
          >
            <i className="fa-solid fa-circle-info"></i> About
          </button>
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          <button
            className="cart-btn"
            onClick={() => setCurrentPage('cart')}
            id="navbar-cart-btn"
          >
            <i className="fa-solid fa-cart-shopping"></i>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>

          {user ? (
            <div className="user-dropdown">
              <button className="user-btn">
                <i className="fa-solid fa-circle-user"></i>
                <span className="user-name">{user.username}</span>
              </button>
              <div className="dropdown-content">
                <button onClick={handleLogout}><i className="fa-solid fa-right-from-bracket"></i> Logout</button>
              </div>
            </div>
          ) : (
            <button
              className="btn-primary login-btn"
              onClick={() => setCurrentPage('auth')}
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <i className="fa-solid fa-user"></i> Login
            </button>
          )}

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} id="hamburger-btn">
            <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {[
            { id: 'home', label: 'Home', icon: 'fa-house' },
            { id: 'products', label: 'Products', icon: 'fa-boxes-stacked' },
            { id: 'about', label: 'About', icon: 'fa-circle-info' },
            { id: 'cart', label: 'Cart', icon: 'fa-cart-shopping' },
          ].map(page => (
            <button
              key={page.id}
              className={`mobile-nav-link ${currentPage === page.id ? 'active' : ''}`}
              onClick={() => { setCurrentPage(page.id); setMenuOpen(false); }}
            >
              <i className={`fa-solid ${page.icon}`}></i>
              {page.label}
              {page.id === 'cart' && totalItems > 0 && <span className="mobile-cart-count"> ({totalItems})</span>}
            </button>
          ))}
          {user ? (
            <button className="mobile-nav-link" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket"></i> Logout ({user.username})
            </button>
          ) : (
            <button className="mobile-nav-link" onClick={() => { setCurrentPage('auth'); setMenuOpen(false); }}>
              <i className="fa-solid fa-user"></i> Login / Sign Up
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
