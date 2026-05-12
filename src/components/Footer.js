import React from 'react';

const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">
      <div className="footer-brand">
        <div className="footer-logo">
          <i className="fa-solid fa-bag-shopping" style={{ fontSize: '1.6rem', color: 'var(--accent)' }}></i>
          <span>ShopWave</span>
        </div>
        <p>Your premium online shopping destination. Quality products, unbeatable prices.</p>
        <div className="footer-social">
          <button className="social-btn" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></button>
          <button className="social-btn" aria-label="Twitter"><i className="fa-brands fa-twitter"></i></button>
          <button className="social-btn" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></button>
          <button className="social-btn" aria-label="YouTube"><i className="fa-brands fa-youtube"></i></button>
        </div>
      </div>

      <div className="footer-links">
        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            <li>Electronics</li>
            <li>Fashion</li>
            <li>Home & Kitchen</li>
            <li>Sports</li>
            <li>New Arrivals</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li>FAQ</li>
            <li>Shipping Policy</li>
            <li>Returns</li>
            <li>Track Order</li>
            <li>Contact Us</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li>About Us</li>
            <li>Careers</li>
            <li>Press</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>
      </div>
    </div>

    <div className="footer-bottom">
      <p>© 2024 ShopWave. All rights reserved. Built with ❤️ by Team ShopWave.</p>
      <div className="payment-icons">
        {['VISA', 'MC', 'PayPal', 'Apple Pay'].map(p => (
          <span key={p} className="payment-badge">{p}</span>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
