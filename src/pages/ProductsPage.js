import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../utils/api';

const categories = ['All', 'Electronics', 'Fashion', 'Home & Kitchen', 'Sports'];
const sortOptions = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'reviews', label: 'Most Reviewed' },
];

const ProductsPage = ({ setCurrentPage, setSelectedProduct, filterCategory, setFilterCategory }) => {
  const [productList, setProductList] = useState([]);
  const [activeCategory, setActiveCategory] = useState(filterCategory || 'All');
  const [sortBy, setSortBy] = useState('default');
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState(3000);

  useEffect(() => {
    const load = async () => {
      const data = await fetchProducts();
      setProductList(data);
    };
    load();
  }, []);

  useEffect(() => {
    if (filterCategory) setActiveCategory(filterCategory);
  }, [filterCategory]);

  const filtered = useMemo(() => {
    let list = [...productList];

    if (activeCategory !== 'All') {
      list = list.filter(p => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    list = list.filter(p => p.price <= maxPrice);

    switch (sortBy) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating': list.sort((a, b) => b.rating - a.rating); break;
      case 'reviews': list.sort((a, b) => b.reviews - a.reviews); break;
      default: break;
    }
    return list;
  }, [activeCategory, sortBy, search, maxPrice]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setFilterCategory(cat === 'All' ? null : cat);
  };

  return (
    <div className="products-page">
      {/* Page Header */}
      <div className="page-header">
        <h1>Our Products</h1>
        <p>Explore our curated collection of premium products</p>
      </div>

      <div className="products-layout">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar">
          <div className="filter-section">
            <h3>Categories</h3>
            <ul className="category-list">
              {categories.map(cat => (
                <li key={cat}>
                  <button
                    className={`cat-filter-btn ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(cat)}
                    id={`filter-${cat.replace(/\s/g, '-').toLowerCase()}`}
                  >
                    {cat}
                    <span className="cat-count">
                      {cat === 'All' ? productList.length : productList.filter(p => p.category === cat).length}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-section">
            <h3>Max Price</h3>
            <div className="price-slider-wrap">
              <input
                type="range"
                min="0"
                max="3000"
                step="50"
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="price-slider"
                id="price-range-slider"
              />
              <div className="price-range-labels">
                <span>$0</span>
                <span className="price-val">${maxPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button
            className="clear-filters-btn"
            onClick={() => { setActiveCategory('All'); setSortBy('default'); setSearch(''); setMaxPrice(3000); setFilterCategory(null); }}
            id="clear-filters-btn"
          >
            Clear Filters
          </button>
        </aside>

        {/* Products Area */}
        <div className="products-area">
          {/* Search & Sort Bar */}
          <div className="products-toolbar">
            <div className="search-wrap">
              <i className="fa-solid fa-magnifying-glass search-icon"></i>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="search-input"
                id="product-search-input"
              />
              {search && (
                <button className="search-clear" onClick={() => setSearch('')}><i className="fa-solid fa-xmark"></i></button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="sort-select"
              id="sort-select"
            >
              {sortOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Results count */}
          <div className="results-info">
            <span>{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</span>
            {(activeCategory !== 'All' || search) && (
              <span className="results-filter-tags">
                {activeCategory !== 'All' && <span className="filter-tag">{activeCategory} <i className="fa-solid fa-xmark"></i></span>}
                {search && <span className="filter-tag">"{search}" <i className="fa-solid fa-xmark"></i></span>}
              </span>
            )}
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="products-grid">
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} onClick={handleProductClick} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <span className="no-results-icon"><i className="fa-solid fa-face-frown-open"></i></span>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search terms.</p>
              <button
                className="btn-primary"
                onClick={() => { setActiveCategory('All'); setSearch(''); setMaxPrice(3000); }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
