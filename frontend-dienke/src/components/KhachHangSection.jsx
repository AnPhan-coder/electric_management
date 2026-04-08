import React, { useState, useEffect, useCallback } from 'react';

const API_URL = 'http://localhost:8080';

export default function KhachHangSection() {
  const [khachHangs, setKhachHangs] = useState([]);
  const [formData, setFormData] = useState({
    makh: '', tenkh: '', diachi: '', dt: '', cmnd: ''
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
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKhachHang();
  }, [fetchKhachHang]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `${API_URL}/khachhang/${formData.makh}` : `${API_URL}/khachhang`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setMessage({ type: 'success', text: ` ${isEditing ? 'Cập nhật' : 'Thêm'} Khách hàng thành công!` });
        setFormData({ makh: '', tenkh: '', diachi: '', dt: '', cmnd: '' });
        setIsEditing(false);
        fetchKhachHang();
      } else {
        const errText = await res.text();
        setMessage({ type: 'error', text: ` Lỗi: ${errText}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: ` Lỗi kết nối: ${error.message}` });
    }
  };

  const handleEdit = (kh) => {
    setFormData(kh);
    setIsEditing(true);
    setMessage(null);
  };

  const handleDelete = async (makh) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa/ẩn Khách hàng ${makh}?`)) return;
    try {
      const res = await fetch(`${API_URL}/khachhang/${makh}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage({ type: 'success', text: ` Xóa/Ẩn khách hàng ${makh} thành công` });
        fetchKhachHang();
      } else {
        const errText = await res.text();
        setMessage({ type: 'error', text: ` Lỗi xóa: ${errText}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: ` Lỗi kết nối: ${error.message}` });
    }
  };

  const handleCancelEdit = () => {
    setFormData({ makh: '', tenkh: '', diachi: '', dt: '', cmnd: '' });
    setIsEditing(false);
    setMessage(null);
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <div className="grid-form">
          <div className="form-group">
            <label>Mã Khách Hàng (Tối đa 13 ký tự)</label>
            <input 
              className="input-field" type="text" name="makh" 
              value={formData.makh} onChange={handleChange} 
              required disabled={isEditing} 
              placeholder="Ví dụ: KH001"
            />
          </div>
          <div className="form-group">
            <label>Tên Khách Hàng</label>
            <input 
              className="input-field" type="text" name="tenkh" 
              value={formData.tenkh} onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Địa Chỉ</label>
            <input 
              className="input-field" type="text" name="diachi" 
              value={formData.diachi} onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Số Điện Thoại</label>
            <input 
              className="input-field" type="text" name="dt" 
              value={formData.dt} onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label>CMND/CCCD</label>
            <input 
              className="input-field" type="text" name="cmnd" 
              value={formData.cmnd} onChange={handleChange} 
            />
          </div>
        </div>
        
        <div className="toolbar-actions" style={{ marginTop: '16px' }}>
          <button type="submit" className="btn btn-primary" style={{ width: 'auto' }}>
            {isEditing ? 'Cập Nhật' : 'Thêm Khách Hàng'}
          </button>
          {isEditing && (
            <button type="button" className="btn btn-cancel" onClick={handleCancelEdit}>
              Hủy
            </button>
          )}
        </div>
      </form>

      {message && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="state-loading">Đang tải danh sách...</div>
      ) : khachHangs.length === 0 ? (
        <div className="state-empty">Chưa có khách hàng nào.</div>
      ) : (
        <div className="table-wrapper">
          <table className="price-table">
            <thead>
              <tr>
                <th>Mã KH</th>
                <th>Tên KH</th>
                <th>Địa Chỉ</th>
                <th>SĐT</th>
                <th>CMND</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {khachHangs.map(kh => (
                <tr key={kh.makh}>
                  <td className="cell-center"><strong>{kh.makh}</strong></td>
                  <td>{kh.tenkh}</td>
                  <td>{kh.diachi}</td>
                  <td className="cell-center">{kh.dt}</td>
                  <td className="cell-center">{kh.cmnd}</td>
                  <td className="cell-center">
                    <button className="btn btn-edit" onClick={() => handleEdit(kh)} style={{ marginRight: '8px', padding: '4px 8px' }}>Sửa</button>
                    <button className="btn btn-error" onClick={() => handleDelete(kh.makh)} style={{ padding: '4px 8px' }}>Xóa</button>
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
