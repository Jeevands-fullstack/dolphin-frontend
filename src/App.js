import React, { useState, useEffect } from 'react';
import './App.css';
import Admin from './Admin';
import BookingModal from './BookingModal';
import Login from './Login';
import ProductPage from './ProductPage';
import dolphin from './assets/dolphin.png';
import heroVideo from './assets/hero-video.mp4';

function App() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activePage, setActivePage] = useState('shop');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  const categories = [
    'All', 'Leggings', 'Kurta Sets', 'Jeans',
    'Patiala Pants', 'Kurtha Top', 'Umbrella Sets', 'Frocks',
    'Western Wear', 'Gym Pants','250 Tops','350 Tops','Jeans Tops',
  ];

  // ✅ ನಿಮ್ಮ ಒರಿಜಿನಲ್ ಹಳೇ ಲಿಂಕ್
  const fetchProducts = () => {
    setLoading(true);
    fetch('https://dolphin-trends.onrender.com/products') 
      .then(r => r.json())
      .then(d => { setProducts(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const filtered = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory);

  const handleAdminClick = () => {
    if (isAdminLoggedIn) {
      setIsAdminLoggedIn(false);
      setShowAdmin(false);
      fetchProducts();
    } else {
      setShowAdmin(!showAdmin);
    }
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (!window.confirm('ಈ product delete ಮಾಡಬೇಕಾ?')) return;
    fetch('https://dolphin-trends.onrender.com/products/' + id, { method: 'DELETE' }) // ✅ ಹಳೇ ಲಿಂಕ್
      .then(r => { if (r.ok) setProducts(p => p.filter(x => x.id !== id)); });
  };

  const handleEditOpen = (e, product) => {
    e.stopPropagation();
    setEditProduct(product);
    setEditForm({
      name: product.name || '',
      price: product.price || '',
      original_price: product.original_price || '',
      category: product.category || '',
      available: product.available !== false,
      image: product.image
    });
  };

  const handleEditSave = () => {
    if (!editProduct) return;
    setEditLoading(true);
    fetch('https://dolphin-trends.onrender.com/products/' + editProduct.id, { // ✅ ಹಳೇ ಲಿಂಕ್
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editProduct, ...editForm }),
    })
      .then(r => r.json())
      .then(updated => {
        setProducts(p => p.map(x => x.id === updated.id ? updated : x));
        setEditProduct(null);
        setEditLoading(false);
      })
      .catch(() => { alert('Update ಆಗಲಿಲ್ಲ!'); setEditLoading(false); });
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="navbar-logo" onClick={() => { setActivePage('shop'); setShowAdmin(false); }} style={{cursor:'pointer'}}>
          <img src={dolphin} alt="Dolphin Trends Logo" />
          <div className="logo-text">
            <h1>🐬 Dolphin Trends</h1>
            <p>Women's Fashion · Bangalore</p>
          </div>
        </div>
        <ul className="navbar-links">
          <li><button className={activePage === 'shop' && !showAdmin ? 'active' : ''} onClick={() => { setActivePage('shop'); setShowAdmin(false); }}>🛍️ Shop</button></li>
          <li><button className={activePage === 'branches' ? 'active' : ''} onClick={() => { setActivePage('branches'); setShowAdmin(false); }}>🏪 Branches</button></li>
          <li><button className={activePage === 'contact' ? 'active' : ''} onClick={() => { setActivePage('contact'); setShowAdmin(false); }}>📞 Contact</button></li>
          <li><button className={activePage === 'location' ? 'active' : ''} onClick={() => { setActivePage('location'); setShowAdmin(false); }}>📍 Location</button></li>
        </ul>
        <div className="navbar-right">
          {isAdminLoggedIn && !showAdmin && <button className="admin-btn" onClick={() => setShowAdmin(true)}>⚙️ Admin Panel</button>}
          <button className="admin-btn" onClick={handleAdminClick}>{isAdminLoggedIn ? '🔓 Logout' : '🛠️ Admin'}</button>
        </div>
      </nav>

      {isAdminLoggedIn && (
        <div style={{textAlign:'center', padding:'6px', background:'rgba(26,108,255,0.1)', borderBottom:'1px solid rgba(26,108,255,0.2)', fontSize:'0.75rem'}}>
          <span className="admin-mode-badge">🔐 Admin Mode Active — Edit & Delete Enabled</span>
        </div>
      )}

      {showAdmin ? (
        isAdminLoggedIn ? <Admin onProductAdded={fetchProducts} /> : <Login onLogin={() => setIsAdminLoggedIn(true)} />
      ) : (
        <>
          {activePage === 'shop' && (
            <div>
              <div className="hero">
                <video autoPlay muted loop playsInline className="hero-video"><source src={heroVideo} type="video/mp4" /></video>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                  <h2>✨ New Arrivals Every Day!</h2>
                  <p>Fresh styles just for you 🌸</p>
                </div>
              </div>
              <div className="categories">
                {categories.map(cat => (
                  <button key={cat} className={cat === activeCategory ? 'cat-btn active' : 'cat-btn'} onClick={() => setActiveCategory(cat)}>{cat}</button>
                ))}
              </div>
              <div className="products-section">
                <h3>{activeCategory === 'All' ? 'All Products' : activeCategory}</h3>
                {loading ? (
                  <div className="loading">Loading... <div className="spinner"></div></div>
                ) : filtered.length === 0 ? (
                  <div className="no-products">😊 ಇನ್ನೂ products ಇಲ್ಲ — ಶೀಘ್ರದಲ್ಲೇ ಬರ್ತಿವೆ!</div>
                ) : (
                  <div className="products-grid">
                    {filtered.map(product => (
                      <div className={product.available === false ? 'product-card not-available' : 'product-card'} key={product.id} onClick={() => setViewProduct(product)}>
                        {product.available === false && <span className="not-available-badge">❌ Not Available</span>}
                        {isAdminLoggedIn && (
                          <div style={{position:'absolute', top:'10px', right:'10px', display:'flex', gap:'6px', zIndex:10}}>
                            <button onClick={e => handleEditOpen(e, product)} style={editBtnStyle}>✏️</button>
                            <button onClick={e => handleDelete(e, product.id)} style={deleteBtnStyle}>🗑️</button>
                          </div>
                        )}
                        <div className="product-card-img-wrap"><img src={product.image} alt={product.name} /></div>
                        <div className="product-info">
                          <span className="category-tag">{product.category}</span>
                          <h4>{product.name}</h4>
                          <p className="price">{product.price}</p>
                          {product.original_price && <p className="original-price-small"><s>{product.original_price}</s></p>}
                          {product.available !== false && <button className="buy-btn" onClick={e => { e.stopPropagation(); setViewProduct(product); }}>🛍️ Buy Now</button>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activePage === 'branches' && (
            <div className="section-page">
              <div className="section-page-header"><h2>🏪 Our Branches</h2></div>
              <div className="branch-grid">
                {[
                  { tag:'Main Branch', name:'Laggere Main Road', addr:'Anikethana Kishore Kendra Laggere, Bangalore — 560058', phone:'📞 +91 7795800741', hours:'Mon–Sun: 11am – 10pm' },
                  { tag:'Branch 2', name:'Rajgopalnagar', addr:'Near Peenya 2nd Stage, Bangalore — 560091', phone:'📞 +91 9353838835', hours:'Mon–Sun: 11am – 10pm' },
                ].map((b, i) => (
                  <div className="branch-card" key={i}>
                    <span className="branch-tag">{b.tag}</span>
                    <h3>{b.name}</h3>
                    <p>{b.addr}</p>
                    <p className="branch-phone">{b.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <footer>
        <p><strong>🐬 Dolphin Trends</strong> | Bangalore</p>
        <p>📱 +91 7795800741 | 📸 Developed by Jeevan JD</p>
      </footer>

      {viewProduct && <ProductPage product={viewProduct} allProducts={products} onClose={() => setViewProduct(null)} onBook={p => setViewProduct(p)} />}
      {selectedProduct && <BookingModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}

      {editProduct && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3>✏️ Product Edit</h3>
            {[{ label:'Product Name', key:'name' }, { label:'Price (₹)', key:'price' }].map(f => (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}</label>
                <input value={editForm[f.key] || ''} onChange={e => setEditForm({...editForm, [f.key]: e.target.value})} style={inputStyle} />
              </div>
            ))}
            <div style={{display:'flex', gap:'10px', marginTop:'22px'}}>
              <button onClick={handleEditSave} disabled={editLoading} style={{flex:1, background:'#1a6cff', color:'#fff', padding:'12px', borderRadius:'10px', cursor:'pointer'}}>{editLoading ? 'Saving...' : '💾 Save'}</button>
              <button onClick={() => setEditProduct(null)} style={{flex:1, background:'#1a1a30', color:'#7a85a0', padding:'12px', borderRadius:'10px', cursor:'pointer'}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const editBtnStyle = { background:'#1a6cff', color:'#fff', border:'none', borderRadius:'7px', padding:'5px 10px', cursor:'pointer' };
const deleteBtnStyle = { background:'#ff3b5c', color:'#fff', border:'none', borderRadius:'7px', padding:'5px 10px', cursor:'pointer' };
const overlayStyle = { position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000 };
const modalStyle = { background:'#0f0f1e', padding:'30px', borderRadius:'18px', color:'#f0f4ff' };
const labelStyle = { fontSize:'0.78rem', color:'#7a85a0' };
const inputStyle = { width:'100%', padding:'10px', marginBottom:'13px', background:'#0b0b18', color:'#f0f4ff' };

export default App;
