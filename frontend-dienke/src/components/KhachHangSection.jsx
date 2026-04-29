import React, { useState, useEffect, useCallback } from 'react';

const API_URL = 'http://localhost:8080';
const ITEMS_PER_PAGE = 10; 

export default function KhachHangSection() {
  const [khachHangs, setKhachHangs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    makh: '',
    tenkh: '',
    diachi: '',
    dt: '',
    cmnd: '',
    trangthai: true
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchKhachHang = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/khachhang`);
      if (res.ok) {
        const data = await res.json();
        setKhachHangs(data);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: '🚀 Lỗi kết nối đến Server!' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKhachHang();
  }, [fetchKhachHang]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'makh') {
      setFormData({ ...formData, [name]: value.slice(0, 13) });
    } else if (name === 'cmnd') {
      const onlyNums = value.replace(/\D/g, '').slice(0, 12);
      setFormData({ ...formData, [name]: onlyNums });
    } else if (name === 'dt') {
      const onlyNums = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, [name]: onlyNums });
    } else if (name === 'trangthai') {
      setFormData({ ...formData, [name]: value === 'true' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (formData.makh.length !== 13) {
      setMessage({ type: 'error', text: `⚠️ Mã khách hàng phải đủ 13 ký tự!` });
      return;
    }
    if (formData.dt.length !== 10 || !formData.dt.startsWith('0')) {
      setMessage({ type: 'error', text: '⚠️ SĐT phải đủ 10 số và bắt đầu bằng số 0!' });
      return;
    }
    if (formData.cmnd.length !== 12) {
      setMessage({ type: 'error', text: `⚠️ CCCD phải đủ 12 chữ số!` });
      return;
    }

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `${API_URL}/khachhang/${formData.makh}` : `${API_URL}/khachhang`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setMessage({ type: 'success', text: `🎉 Thành công!` });
        handleCancelEdit();
        fetchKhachHang();
      } else {
        const errText = await res.text();
        setMessage({ type: 'error', text: `❌ Lỗi: ${errText}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '🚀 Lỗi kết nối!' });
    }
  };

  const handleToggleStatus = async (kh) => {
    const action = kh.trangthai ? "KHÓA" : "MỞ LẠI";
    if (!window.confirm(`Xác nhận ${action} khách hàng ${kh.makh}?`)) return;
    try {
      const res = await fetch(`${API_URL}/khachhang/${kh.makh}`, { method: 'DELETE' });
      if (res.ok) {
        fetchKhachHang();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (kh) => {
    setFormData(kh);
    setIsEditing(true);
    setMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setFormData({ makh: '', tenkh: '', diachi: '', dt: '', cmnd: '', trangthai: true });
    setIsEditing(false);
    setMessage(null);
  };

  const filteredKhachHangs = khachHangs.filter(kh =>
    kh.tenkh?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kh.makh?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kh.dt?.includes(searchTerm)
  );

  const totalItems = filteredKhachHangs.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredKhachHangs.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="card">
      <h3 style={{ color: '#1a3a5f', marginBottom: '20px' }}>
        👤 {isEditing ? 'CẬP NHẬT THÔNG TIN' : 'THIẾT LẬP KHÁCH HÀNG MỚI'}
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="grid-form">
          <div className="form-group">
            <label>Mã Khách Hàng (13 ký tự)</label>
            <input className="input-field" type="text" name="makh" value={formData.makh} onChange={handleChange} required disabled={isEditing} />
          </div>
          <div className="form-group">
            <label>Họ và Tên</label>
            <input className="input-field" type="text" name="tenkh" value={formData.tenkh} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Số Điện Thoại (10 số)</label>
            <input className="input-field" type="text" name="dt" value={formData.dt} onChange={handleChange} required />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / span 2' }}>
            <label>Địa Chỉ Thường Trú</label>
            <input className="input-field" type="text" name="diachi" value={formData.diachi} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Trạng Thái</label>
            <select className="input-field" name="trangthai" value={formData.trangthai} onChange={handleChange}>
              <option value="true">🟢 Đang hoạt động</option>
              <option value="false">🔴 Ngưng dịch vụ</option>
            </select>
          </div>
          <div className="form-group">
            <label>CMND/CCCD (12 số)</label>
            <input className="input-field" type="text" name="cmnd" value={formData.cmnd} onChange={handleChange} required />
          </div>
        </div>
        
        <div className="toolbar-actions" style={{ marginTop: '20px', justifyContent: 'flex-end' }}>
          {isEditing && <button type="button" className="btn btn-cancel" onClick={handleCancelEdit} style={{ marginRight: '10px' }}>Hủy bỏ</button>}
          <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#1a3a5f', padding: '10px 25px' }}>
            {isEditing ? 'LƯU CẬP NHẬT' : '+ LƯU THÔNG TIN'}
          </button>
        </div>
      </form>

      {message && <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`} style={{ marginTop: '15px' }}>{message.text}</div>}

      <div style={{ marginTop: '40px', marginBottom: '20px', width: '100%' }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
          <input 
            type="text" placeholder="Tìm theo Mã KH, Tên hoặc SĐT..." className="input-field"
            style={{ width: '100%', paddingLeft: '45px', borderRadius: '25px', border: '2px solid #ffd43b' }}
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="price-table">
          <thead style={{ backgroundColor: '#0056b3', color: 'white' }}>
            <tr>
              <th style={{ width: '50px' }}>STT</th>
              <th>MÃ KH</th>
              <th>KHÁCH HÀNG</th>
              <th>LIÊN LẠC</th>
              <th>TRẠNG THÁI</th>
              <th>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="cell-center">Đang tải...</td></tr>
            ) : currentItems.length === 0 ? (
              <tr><td colSpan="6" className="cell-center">Không tìm thấy khách hàng nào.</td></tr>
            ) : (
              currentItems.map((kh, index) => (
                <tr key={kh.makh} style={{ opacity: kh.trangthai ? 1 : 0.6 }}>
                  <td className="cell-center">{indexOfFirstItem + index + 1}</td>
                  <td className="cell-center"><strong>{kh.makh}</strong></td>
                  <td>
                    <div style={{ fontWeight: 'bold' }}>{kh.tenkh.toUpperCase()}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{kh.diachi}</div>
                  </td>
                  <td>
                    <div>📱 {kh.dt}</div>
                    <div style={{ fontSize: '11px', color: '#888' }}>CCCD: {kh.cmnd}</div>
                  </td>
                  <td className="cell-center">
                    <span style={{
                      padding: '4px 12px', borderRadius: '15px', fontSize: '11px', fontWeight: 'bold',
                      backgroundColor: kh.trangthai ? '#ebfbee' : '#fff5f5',
                      color: kh.trangthai ? '#2f9e44' : '#e03131',
                      border: `1px solid ${kh.trangthai ? '#b2f2bb' : '#ffa8a8'}`
                    }}>
                      {kh.trangthai ? '✔ HOẠT ĐỘNG' : '✘ KHÓA'}
                    </span>
                  </td>
                  <td className="cell-center">
                    <button className="btn-icon" onClick={() => handleEdit(kh)}>✏️</button>
                    <button onClick={() => handleToggleStatus(kh)} style={{ marginLeft: '10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px' }}>
                      {kh.trangthai ? '🔒' : '🔓'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* THANH PHÂN TRANG (CẬP NHẬT) */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '15px 20px', backgroundColor: '#f8f9fa', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px'
      }}>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Hiển thị trang {currentPage} / {totalPages || 1} ({currentItems.length} / {totalItems} khách hàng)
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(prev => prev - 1)}
            style={{ 
              padding: '4px 12px', 
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer', 
              borderRadius: '4px', border: '1px solid #ddd', 
              backgroundColor: 'white',
              fontSize: '18px',
              fontWeight: 'bold'
            }}
          >
            &#8249; {/* Biểu tượng mũi tên trái < */}
          </button>
          <button 
            disabled={currentPage === totalPages || totalPages === 0} 
            onClick={() => setCurrentPage(prev => prev + 1)}
            style={{ 
              padding: '4px 12px', 
              cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer', 
              borderRadius: '4px', border: '1px solid #ddd', 
              backgroundColor: 'white',
              fontSize: '18px',
              fontWeight: 'bold'
            }}
          >
            &#8250; {/* Biểu tượng mũi tên phải > */}
          </button>
        </div>
      </div>
    </div>
  );
}