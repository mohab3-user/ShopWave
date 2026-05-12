import React from 'react';

const team = [
  { name: 'Ahmed Mohamed Abou EL Yazid', id: '2401317', role: 'Frontend Developer', avatar: 'A' },
  { name: 'Mohab Ahmed Nayel',            id: '2401307', role: 'UI/UX Designer',      avatar: 'M' },
  { name: 'Moataz Ahmed Khaifa',          id: '2401315', role: 'JavaScript Developer', avatar: 'M' },
  { name: 'Ahmed Mokhtar Farag',          id: '2401338', role: 'Backend & Logic',      avatar: 'A' },
];

const AboutPage = () => (
  <div className="about-page">
    {/* Hero */}
    <section className="about-hero">
      <div className="about-hero-content">
        <h1>About <span className="gradient-text">ShopWave</span></h1>
        <p>We're a team of passionate students building the future of online shopping — one pixel at a time.</p>
      </div>
    </section>

    {/* Mission */}
    <section className="section">
      <div className="about-mission">
        <div className="mission-text">
          <h2>Our Mission</h2>
          <p>
            ShopWave was born from a simple idea: online shopping should be <strong>effortless, beautiful, and trustworthy</strong>.
            We aim to bridge the gap between customers and quality products through a seamless web experience.
          </p>
          <p>
            Built with modern web technologies (HTML, CSS, JavaScript & React), this project demonstrates our ability to design
            and implement a fully-functional e-commerce platform from scratch.
          </p>
          <div className="about-highlights">
            {[
              { icon: 'fa-bullseye', title: 'User-First', desc: 'Every design decision revolves around the user experience.' },
              { icon: 'fa-bolt', title: 'Performance', desc: 'Fast, responsive, and optimized for all devices.' },
              { icon: 'fa-lock', title: 'Secure', desc: 'Shopping with confidence — your data is always safe.' },
            ].map(h => (
              <div key={h.title} className="highlight-item">
                <span className="highlight-icon"><i className={`fa-solid ${h.icon}`}></i></span>
                <div>
                  <strong>{h.title}</strong>
                  <p>{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mission-visual">
          <div className="about-stats-grid">
            {[
              { num: '16+', label: 'Products', icon: 'fa-boxes-packing' },
              { num: '4', label: 'Categories', icon: 'fa-list' },
              { num: '100%', label: 'Pure JS', icon: 'fa-code' },
              { num: '4★', label: 'Team Rating', icon: 'fa-star' },
            ].map(s => (
              <div key={s.label} className="about-stat-card">
                <i className={`fa-solid ${s.icon}`} style={{ fontSize: '1.2rem', color: 'var(--accent)', marginBottom: '8px', opacity: 0.6 }}></i>
                <strong>{s.num}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Tech Stack */}
    <section className="section section-dark">
      <div className="section-header">
        <h2>Technologies Used</h2>
        <p>Built with cutting-edge web technologies</p>
      </div>
      <div className="tech-grid">
        {[
          { name: 'HTML5', icon: 'fa-html5', brand: true, desc: 'Semantic markup and page structure' },
          { name: 'CSS3', icon: 'fa-css3-alt', brand: true, desc: 'Animations, gradients, and responsive design' },
          { name: 'JavaScript', icon: 'fa-js', brand: true, desc: 'Cart logic, filtering, and interactivity' },
          { name: 'React', icon: 'fa-react', brand: true, desc: 'Component-based UI architecture' },
          { name: 'Context API', icon: 'fa-link', brand: false, desc: 'Global state management for the cart' },
          { name: 'LocalStorage', icon: 'fa-database', brand: false, desc: 'Persistent cart across sessions' },
        ].map(t => (
          <div key={t.name} className="tech-card">
            <span className="tech-icon"><i className={`${t.brand ? 'fa-brands' : 'fa-solid'} ${t.icon}`}></i></span>
            <h3>{t.name}</h3>
            <p>{t.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Features */}
    <section className="section">
      <div className="section-header">
        <h2>Project Features</h2>
        <p>Everything you'd expect from a real e-commerce platform</p>
      </div>
      <div className="features-grid">
        {[
          { icon: 'fa-house', title: 'Home Page', desc: 'Hero section, categories, featured products, and promotional banners.' },
          { icon: 'fa-box', title: 'Product Listing', desc: 'Browse all products with filtering by category, price, and search.' },
          { icon: 'fa-magnifying-glass', title: 'Product Details', desc: 'Full product page with images, specs, reviews, and related items.' },
          { icon: 'fa-cart-shopping', title: 'Shopping Cart', desc: 'Add, remove, update quantities, and view running total.' },
          { icon: 'fa-calculator', title: 'Price Calculation', desc: 'Automatic subtotal, shipping, and discount calculations.' },
          { icon: 'fa-ticket', title: 'Promo Codes', desc: 'Apply discount codes (try SAVE10) at checkout.' },
          { icon: 'fa-mobile-screen', title: 'Responsive Design', desc: 'Fully optimized for mobile, tablet, and desktop.' },
          { icon: 'fa-floppy-disk', title: 'Cart Persistence', desc: 'Cart is saved in browser storage between sessions.' },
        ].map(f => (
          <div key={f.title} className="feature-card">
            <span className="feature-card-icon"><i className={`fa-solid ${f.icon}`}></i></span>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Team */}
    <section className="section section-dark">
      <div className="section-header">
        <h2>Meet the Team</h2>
        <p>The brilliant minds behind ShopWave</p>
      </div>
      <div className="team-grid">
        {team.map((member, i) => (
          <div key={member.id} className="team-card" style={{ '--delay': `${i * 0.1}s` }}>
            <div className="team-avatar">{member.avatar}</div>
            <h3>{member.name}</h3>
            <span className="team-role">{member.role}</span>
            <span className="team-id">ID: {member.id}</span>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default AboutPage;
