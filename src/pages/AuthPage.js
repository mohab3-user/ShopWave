import React, { useState } from 'react';
import { loginUser, signupUser } from '../utils/api';

const AuthPage = ({ setCurrentPage, handleLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        if (formData.username && formData.password) {
          const res = await loginUser({ username: formData.username, password: formData.password });
          handleLogin(res.user);
        } else {
          setError('Please fill in all fields');
        }
      } else {
        if (formData.username && formData.email && formData.password) {
          if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
          }
          const res = await signupUser({ 
            username: formData.username, 
            email: formData.email, 
            password: formData.password 
          });
          // Auto login after signup
          handleLogin(res.user);
        } else {
          setError('Please fill in all fields');
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <i className="fa-solid fa-bag-shopping"></i>
              <span>ShopWave</span>
            </div>
            <h1>{isLogin ? 'Welcome Back!' : 'Create Account'}</h1>
            <p>{isLogin ? 'Sign in to continue your shopping journey' : 'Join thousands of happy shoppers today'}</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-wrap">
                <i className="fa-solid fa-user"></i>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrap">
                  <i className="fa-solid fa-envelope"></i>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <i className="fa-solid fa-lock"></i>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrap">
                  <i className="fa-solid fa-shield-check"></i>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="form-footer-links">
                <label className="checkbox-wrap">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <button type="button" className="link-btn">Forgot Password?</button>
              </div>
            )}

            <button type="submit" className="btn-primary auth-btn">
              {isLogin ? 'Sign In' : 'Create Account'}
              <i className="fa-solid fa-arrow-right-to-bracket"></i>
            </button>
          </form>

          <div className="auth-switch">
            {isLogin ? (
              <p>Don't have an account? <button onClick={() => setIsLogin(false)}>Sign Up</button></p>
            ) : (
              <p>Already have an account? <button onClick={() => setIsLogin(true)}>Sign In</button></p>
            )}
          </div>
        </div>

        <div className="auth-visual">
          <div className="visual-content">
            <div className="badge">⭐ Premium Experience</div>
            <h2>The best products are just a click away.</h2>
            <div className="feature-list">
              <div className="feature-item">
                <i className="fa-solid fa-bolt"></i>
                <span>Flash-speed delivery</span>
              </div>
              <div className="feature-item">
                <i className="fa-solid fa-shield-halved"></i>
                <span>Secure payment systems</span>
              </div>
              <div className="feature-item">
                <i className="fa-solid fa-headset"></i>
                <span>24/7 dedicated support</span>
              </div>
            </div>
          </div>
          <div className="visual-circles">
            <div className="circle c1"></div>
            <div className="circle c2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
