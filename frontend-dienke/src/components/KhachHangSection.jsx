import React, { useState, useEffect, useCallback } from 'react';

const API_URL = 'http://localhost:8080';

export default function KhachHangSection() {
  const [khachHangs, setKhachHangs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    makh: '',
    tenkh: '',
    diachi: '',
    dt: '',
    cmnd: '',
    trangthai: true // Mặc định là Đang hoạt động (true)
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Lấy danh sách khách hàng
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

  // 2. Logic Tìm kiếm
  const filteredKhachHangs = khachHangs.filter(kh =>
    kh.tenkh?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kh.makh?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kh.dt?.includes(searchTerm)
  );

  // 3. Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'makh') {
      setFormData({ ...formData, [name]: value.slice(0, 13) });
    } 
    else if (name === 'cmnd') {
      const onlyNums = value.replace(/\D/g, '').slice(0, 12);
      setFormData({ ...formData, [name]: onlyNums });
    } 
    else if (name === 'dt') {
      const onlyNums = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, [name]: onlyNums });
    } 
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 4. Thêm hoặc Cập nhật
const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    // Ràng buộc Mã khách hàng: Phải ĐÚNG 13 ký tự
    if (formData.makh.length !== 13) {
      setMessage({ 
        type: 'error', 
        text: `⚠️ Mã khách hàng đang có ${formData.makh.length} ký tự. Phải nhập ĐÚNG 13 ký tự!` 
      });
      return;
    }

    // Ràng buộc Số điện thoại: Phải ĐÚNG 10 số và bắt đầu bằng số 0
    if (formData.dt.length !== 10 || !formData.dt.startsWith('0')) {
      setMessage({ type: 'error', text: '⚠️ Số điện thoại phải ĐÚNG 10 số và bắt đầu bằng số 0!' });
      return;
    }

    // Ràng buộc CCCD: Phải ĐÚNG 12 số
    if (formData.cmnd.length !== 12) {
      setMessage({ 
        type: 'error', 
        text: `⚠️ CCCD đang có ${formData.cmnd.length} số. Phải nhập ĐÚNG 12 chữ số!` 
      });
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
        setMessage({ type: 'success', text: `🎉 ${isEditing ? 'Cập nhật' : 'Thêm'} thành công!` });
        handleCancelEdit();
        fetchKhachHang();
      } else {
        const errText = await res.text();
        setMessage({ type: 'error', text: `❌ Lỗi: ${errText}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `🚀 Lỗi kết nối: ${error.message}` });
    }
  };

  const handleEdit = (kh) => {
    setFormData(kh);
    setIsEditing(true);
    setMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 5. Logic Khóa/Mở (Thay thế cho Xóa)
  const handleToggleStatus = async (kh) => {
    const actionName = kh.trangthai ? "KHÓA (Ngưng dịch vụ)" : "MỞ LẠI dịch vụ";
    if (!window.confirm(`Bạn có chắc muốn ${actionName} khách hàng ${kh.makh}?`)) return;

    try {
      // Gọi lên DELETE (Backend của bạn sẽ xử lý đảo trạng thái trangthai)
      const res = await fetch(`${API_URL}/khachhang/${kh.makh}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage({ type: 'success', text: `✅ Đã thay đổi trạng thái khách hàng ${kh.makh}` });
        fetchKhachHang();
      } else {
        setMessage({ type: 'error', text: '❌ Không thể thực hiện thao tác này!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '🚀 Lỗi kết nối khi thay đổi trạng thái!' });
    }
  };

  const handleCancelEdit = () => {
    setFormData({ makh: '', tenkh: '', diachi: '', dt: '', cmnd: '', trangthai: true });
    setIsEditing(false);
    setMessage(null);
  };

  return (
    <div className="card">
      {/* FORM THIẾT LẬP */}
      <h3 style={{ color: '#1a3a5f', marginBottom: '20px' }}>
        👤 {isEditing ? 'CẬP NHẬT THÔNG TIN' : 'THIẾT LẬP KHÁCH HÀNG MỚI'}
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="grid-form">
          <div className="form-group">
            <label>Mã Khách Hàng</label>
            <input 
              className="input-field" type="text" name="makh" 
              value={formData.makh} onChange={handleChange} 
              required disabled={isEditing} placeholder="KH..."
            />
          </div>
          <div className="form-group">
            <label>Họ và Tên</label>
            <input 
              className="input-field" type="text" name="tenkh" 
              value={formData.tenkh} onChange={handleChange} required 
            />
          </div>
          <div className="form-group">
            <label>Số Điện Thoại</label>
            <input 
              className="input-field" type="text" name="dt"
              value={formData.dt} onChange={handleChange} required
              placeholder="09xxx..."
            />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / span 2' }}>
            <label>Địa Chỉ Thường Trú</label>
            <input 
              className="input-field" type="text" name="diachi" 
              value={formData.diachi} onChange={handleChange} required 
            />
          </div>
          <div className="form-group">
            <label>Trạng Thái Dịch Vụ</label>
            <select 
              className="input-field" name="trangthai" 
              value={formData.trangthai} onChange={handleChange}
            >
              <option value="true">🟢 Đang hoạt động</option>
              <option value="false">🔴 Ngưng dịch vụ</option>
            </select>
          </div>
          <div className="form-group">
            <label>CMND/CCCD</label>
            <input 
              className="input-field" type="text" name="cmnd" 
              value={formData.cmnd} onChange={handleChange} 
            />
          </div>
        </div>
        
        <div className="toolbar-actions" style={{ marginTop: '20px', justifyContent: 'flex-end' }}>
          {isEditing && (
            <button type="button" className="btn btn-cancel" onClick={handleCancelEdit} style={{ marginRight: '10px' }}>
              Hủy bỏ
            </button>
          )}
          <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#1a3a5f', padding: '10px 25px' }}>
            {isEditing ? 'LƯU CẬP NHẬT' : '+ LƯU THÔNG TIN KHÁCH HÀNG'}
          </button>
        </div>
      </form>

      {message && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`} style={{ marginTop: '15px' }}>
          {message.text}
        </div>
      )}

      {/* THANH TÌM KIẾM DÀI 100% */}
      <div style={{ marginTop: '40px', marginBottom: '20px', width: '100%' }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
          <input 
            type="text" 
            placeholder="Tìm theo Mã KH, Tên hoặc SĐT khách hàng..." 
            className="input-field"
            style={{ width: '100%', paddingLeft: '45px', borderRadius: '25px', border: '2px solid #ffd43b' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* BẢNG DANH SÁCH */}
      {loading ? (
        <div className="state-loading">Đang truy xuất dữ liệu...</div>
      ) : filteredKhachHangs.length === 0 ? (
        <div className="state-empty">Không tìm thấy khách hàng nào phù hợp.</div>
      ) : (
        <div className="table-wrapper">
          <table className="price-table">
            <thead style={{ backgroundColor: '#0056b3', color: 'white' }}>
              <tr>
                <th style={{ width: '50px' }}>STT</th>
                <th>MÃ KH</th>
                <th>KHÁCH HÀNG</th>
                <th>THÔNG TIN LIÊN LẠC</th>
                <th>TRẠNG THÁI</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {filteredKhachHangs.map((kh, index) => (
                <tr key={kh.makh} style={{ opacity: kh.trangthai ? 1 : 0.6 }}>
                  <td className="cell-center">{index + 1}</td>
                  <td className="cell-center"><span className="code-label">{kh.makh}</span></td>
                  <td>
                    <div style={{ fontWeight: 'bold', color: '#1a3a5f' }}>{kh.tenkh.toUpperCase()}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{kh.diachi}</div>
                  </td>
                  <td>
                    <div>📱 {kh.dt}</div>
                    <div style={{ fontSize: '11px', color: '#888' }}>CCCD: {kh.cmnd || 'Chưa cập nhật'}</div>
                  </td>
                  <td className="cell-center">
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '15px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      backgroundColor: kh.trangthai ? '#ebfbee' : '#fff5f5',
                      color: kh.trangthai ? '#2f9e44' : '#e03131',
                      border: `1px solid ${kh.trangthai ? '#b2f2bb' : '#ffa8a8'}`
                    }}>
                      {kh.trangthai ? '✔ HOẠT ĐỘNG' : '✘ NGƯNG DỊCH VỤ'}
                    </span>
                  </td>
                  <td className="cell-center">
                    <button 
                      className="btn-icon" 
                      onClick={() => handleEdit(kh)} 
                      title="Sửa"
                      style={{ border: '1px solid #ddd', background: 'none', borderRadius: '50%', padding: '5px' }}
                    >✏️</button>
                    <button 
                      onClick={() => handleToggleStatus(kh)}
                      title={kh.trangthai ? "Khóa" : "Mở khóa"}
                      style={{ 
                        marginLeft: '10px', 
                        border: 'none', 
                        background: 'none', 
                        fontSize: '18px', 
                        cursor: 'pointer' 
                      }}
                    >
                      {kh.trangthai ? '🔒' : '🔓'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}