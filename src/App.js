import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import { fetchProducts } from './utils/api';
import './App.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  const loadProducts = async () => {
    setProductsLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
      if (selectedProduct) {
        const updated = data.find(p => p.id === selectedProduct.id);
        if (updated) setSelectedProduct(updated);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSetCurrentPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (userData) => {
    setUser(userData);
    handleSetCurrentPage('home');
  };

  const handleLogout = () => {
    setUser(null);
    handleSetCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            setCurrentPage={handleSetCurrentPage}
            setSelectedProduct={setSelectedProduct}
            setFilterCategory={setFilterCategory}
            products={products}
          />
        );
      case 'products':
        return (
          <ProductsPage
            setCurrentPage={handleSetCurrentPage}
            setSelectedProduct={setSelectedProduct}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            products={products}
          />
        );
      case 'product-detail':
        return (
          <ProductDetailPage
            product={selectedProduct}
            setCurrentPage={handleSetCurrentPage}
            setSelectedProduct={setSelectedProduct}
          />
        );
      case 'cart':
        return <CartPage setCurrentPage={handleSetCurrentPage} user={user} />;
      case 'about':
        return <AboutPage />;
      case 'auth':
        return <AuthPage setCurrentPage={handleSetCurrentPage} handleLogin={handleLogin} />;
      case 'profile':
        return (
          <ProfilePage
            user={user}
            products={products}
            fetchProducts={loadProducts}
            setCurrentPage={handleSetCurrentPage}
            setSelectedProduct={setSelectedProduct}
          />
        );
      default:
        return (
          <HomePage
            setCurrentPage={handleSetCurrentPage}
            setSelectedProduct={setSelectedProduct}
            setFilterCategory={setFilterCategory}
            products={products}
          />
        );
    }
  };

  return (
    <CartProvider>
      <div className="app">
        <Navbar
          currentPage={currentPage}
          setCurrentPage={handleSetCurrentPage}
          user={user}
          handleLogout={handleLogout}
        />
        <main className="main-content">
          {renderPage()}
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
};

export default App;
