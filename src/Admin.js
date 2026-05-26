import React, { useState, useRef, useEffect } from 'react';

function Admin({ onProductAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    category: 'Tops'
  });
  
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  // 📥 ಕೇವಲ ನಿಮ್ಮ ಹಳೇ ಲಿಂಕ್ ಬಳಸಲಾಗಿದೆ ಜೀವನ್
  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const response = await fetch('https://dolphin-trends.onrender.com/api/admin/bookings');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setBookings(data);
        } else {
          setBookings([]);
        }
      } else {
        setBookings([]);
      }
    } catch (error) {
      setBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleBookingAction = async (bookingId, action, customerName) => {
    let actionText = action === 'agree' ? "AGREE" : "DISAGREE";
    if (!window.confirm(`ನಿಜವಾಗಲೂ ಈ ಆರ್ಡರ್ ಅನ್ನು ${actionText} ಮಾಡಬೇಕಾ ಜೀವನ್?`)) return;

    try {
      const response = await fetch(`https://dolphin-trends.onrender.com/api/admin/update-booking?booking_id=${bookingId}&action=${action}`, {
        method: 'POST',
      });
      if (response.ok) {
        alert(`✅ ಯಶಸ್ವಿ! ${customerName} ಅವರ ವಾಟ್ಸಾಪ್‌ಗೆ ಮೆಸೇಜ್ ಕಳುಹಿಸಲಾಗಿದೆ.`);
        fetchBookings();
      } else {
        alert("❌ ಅಪ್ಡೇಟ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.");
      }
    } catch (error) {
      alert("❌ ಸರ್ವರ್ ಎರರ್!");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAddProduct = async () => {
    const file = fileInputRef.current.files[0];
    if (!formData.name || !formData.price || !file) {
      alert("⚠️ ದಯವಿಟ್ಟು ಫೋಟೋ, ಹೆಸರು ಮತ್ತು ಮಾರಾಟದ ಬೆಲೆಯನ್ನು ನಮೂದಿಸಿ!");
      return;
    }

    setLoading(true);
    const dataToSend = new FormData();
    dataToSend.append('name', formData.name);
    dataToSend.append('price', `₹${formData.price}`);
    dataToSend.append('original_price', formData.original_price ? `₹${formData.original_price}` : "");
    dataToSend.append('description', formData.description);
    dataToSend.append('category', formData.category);
    dataToSend.append('file', file);

    try {
      // ✅ ನಿಮ್ಮ ಒರಿಜಿನಲ್ ಹಳೇ ಲಿಂಕ್
      const response = await fetch('https://dolphin-trends.onrender.com/products', {
        method: 'POST',
        body: dataToSend,
      });

      if (response.ok) {
        alert("✅ Product ಯಶಸ್ವಿಯಾಗಿ ಸೇವ್ ಆಗಿದೆ!");
        setFormData({ name: '', description: '', price: '', original_price: '', category: 'Tops' });
        setPreview(null);
        fileInputRef.current.value = "";
        if (onProductAdded) onProductAdded();
      } else {
        alert("❌ ಸೇವ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ!");
      }
    } catch (error) {
      alert("❌ ಸರ್ವರ್ ಕನೆಕ್ಷನ್ ಎರರ್!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', color: '#000', background: '#fff' }}>
      <div className="admin-card" style={{ marginBottom: '40px', background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
        <h2>🛠️ Admin Panel</h2>
        <div className="form-section">
          <div className="input-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>👗 Dress Photo</label>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} />
            {preview && <img src={preview} alt="Preview" style={{width: '100px', marginTop: '10px', borderRadius: '8px'}} />}
          </div>
          <div className="input-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Product Name</label>
            <input type="text" placeholder="eg: Silk Saree" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div className="input-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Description</label>
            <textarea placeholder="Enter product details..." rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div className="input-row" style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Selling Price (₹)</label>
              <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Original Price (₹)</label>
              <input type="number" value={formData.original_price} onChange={(e) => setFormData({...formData, original_price: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
          </div>
          <div className="input-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Category</label>
            <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="Tops">Tops</option>
              <option value="Kurthas Sets">Kurthas Sets</option>
              <option value="Jeans">Jeans</option>
              <option value="Umbrella Sets">Sets</option>
              <option value="Western wear">Western wear</option>
              <option value="250 Tops">250 Tops</option>
              <option value="Kurtha Tops">Kurtha Tops</option>
              <option value="Jeans Tops">Jeans Tops</option>
              <option value="Leggins">Leggins</option>
              <option value="350 Sets">350 Sets</option>
              <option value="frocks">frocks</option>
            </select>
          </div>
          <button onClick={handleAddProduct} disabled={loading} style={{ padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            {loading ? "Saving..." : "✅ Add Product"}
          </button>
        </div>
      </div>

      <hr style={{ border: '1px solid #ddd', margin: '40px 0' }} />

      {/* 📥 ಬುಕಿಂಗ್ಸ್ ಟೇಬಲ್ */}
      <div className="admin-card" style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#333', margin: 0 }}>📥 Customer Bookings List</h2>
          <button onClick={fetchBookings} style={{ padding: '8px 16px', borderRadius: '4px', background: '#007bff', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>🔄 Refresh</button>
        </div>

        {bookingsLoading ? (
          <p>ಬುಕಿಂಗ್ಸ್ ಲೋಡ್ ಆಗುತ್ತಿದೆ ಜೀವನ್...</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
              <thead>
                <tr style={{ background: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Customer Name</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Phone</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Product</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Photo</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: 'gray' }}>ಯಾವ ಬುಕಿಂಗ್ಸ್ ಬಂದಿಲ್ಲ ಜೀವನ್! (ಬ್ಯಾಕೆಂಡ್ ಚೆಕ್ ಮಾಡಿ)</td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b.booking_id} style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '12px' }}><b>{b.customer_name}</b></td>
                      <td style={{ padding: '12px' }}>{b.customer_phone}</td>
                      <td style={{ padding: '12px' }}>{b.product_name}</td>
                      <td style={{ padding: '12px' }}><a href={b.image_url} target="_blank" rel="noreferrer" style={{ color: '#007bff', fontWeight: 'bold' }}>View 📸</a></td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', background: b.status === 'Pending' ? '#ffeaa7' : '#dfe6e9', color: '#000' }}>
                          {b.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        {b.status === 'Pending' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleBookingAction(b.booking_id, 'agree', b.customer_name)} style={{ background: '#28a745', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Agree</button>
                            <button onClick={() => handleBookingAction(b.booking_id, 'disagree', b.customer_name)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Disagree</button>
                          </div>
                        ) : <span>Done</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
