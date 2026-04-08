import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:8080';

function App() {
  return (
    <div className="app-container">
      <h1 className="page-title">TEST API QUẢN LÝ TIỀN ĐIỆN</h1>

      <div className="grid-container">
        <DienKeSection />
        <HoaDonSection />
      </div>

      <div style={{ marginTop: '30px' }}>
        <KhachHangSection />
      </div>
    </div>
  );
}

function DienKeSection() {
  const [dienKe, setDienKe] = useState({ madk: '', makh: '', ngaysx: '', ngaylap: '', mota: '', trangthai: true });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDienKe({ ...dienKe, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/dienke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dienKe)
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`✅ Thêm thành công Điện kế: ${data.madk}`);
        setIsError(false);
      } else {
        const errorText = await response.text();
        setMessage(`❌ Lỗi: ${errorText}`);
        setIsError(true);
      }
    } catch (error) {
      setMessage(`❌ Lỗi kết nối: ${error.message}`);
      setIsError(true);
    }
  };

  return (
    <div className="card">
      <h2>1. Thêm Điện Kế Mới</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group"><label>Mã điện kế (8 số)</label><input className="input-field" type="text" name="madk" placeholder="VD: 12345678" onChange={handleChange} required /></div>
        <div className="form-group"><label>Mã khách hàng</label><input className="input-field" type="text" name="makh" placeholder="Nhập mã KH..." onChange={handleChange} required /></div>
        <div className="form-group"><label>Ngày sản xuất</label><input className="input-field" type="datetime-local" name="ngaysx" onChange={handleChange} required /></div>
        <div className="form-group"><label>Ngày lắp đặt</label><input className="input-field" type="datetime-local" name="ngaylap" onChange={handleChange} required /></div>
        <div className="form-group"><label>Mô tả</label><input className="input-field" type="text" name="mota" placeholder="Nhập mô tả..." onChange={handleChange} required /></div>
        <label className="checkbox-group"><input type="checkbox" name="trangthai" checked={dienKe.trangthai} onChange={handleChange} /> Hoạt động bình thường</label>
        <button type="submit" className="btn btn-success">Lưu Điện Kế</button>
      </form>
      {message && <div className={`alert ${isError ? 'alert-error' : 'alert-success'}`}>{message}</div>}
    </div>
  );
}

function HoaDonSection() {
  const [reqData, setReqData] = useState({ madk: '', chisocuoi: '', denngay: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setReqData({ ...reqData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError('');
    try {
      const payload = { madk: reqData.madk, chisocuoi: parseInt(reqData.chisocuoi), denngay: reqData.denngay };
      const response = await fetch(`${API_URL}/hoadon/tinhtien`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        const errorText = await response.text();
        setError(`❌ Lỗi: ${errorText}`);
      }
    } catch (err) {
      setError(`❌ Lỗi kết nối: ${err.message}`);
    }
  };

  return (
    <div className="card">
      <h2>2. Tính Tiền & Chốt Số Hóa Đơn</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group"><label>Mã điện kế</label><input className="input-field" type="text" name="madk" placeholder="Nhập mã ĐK cần tính..." onChange={handleChange} required /></div>
        <div className="form-group"><label>Chỉ số cuối</label><input className="input-field" type="number" name="chisocuoi" placeholder="Nhập chỉ số KW chốt cuối tháng..." onChange={handleChange} required /></div>
        <div className="form-group"><label>Ngày chốt số (Đến ngày)</label><input className="input-field" type="datetime-local" name="denngay" onChange={handleChange} required /></div>
        <button type="submit" className="btn btn-primary">Thực thi Tính Tiền</button>
      </form>
      {error && <div className="alert alert-error">{error}</div>}
      {result && (
        <div className="bill-result">
          <h3>✅ Lập Hóa Đơn Thành Công</h3>
          <p>Mã Hóa Đơn: <strong>{result.mahd}</strong></p>
          <p>Kỳ thanh toán: <strong>{result.ky}</strong></p>
          <p>Chỉ số đầu: <strong>{result.chisodau}</strong></p>
          <p>Chỉ số cuối: <strong>{result.chisocuoi}</strong></p>
          <p className="total-amount">Tổng thành tiền: <span>{result.tongthanhtien.toLocaleString('vi-VN')} VNĐ</span></p>
        </div>
      )}
    </div>
  );
}

function KhachHangSection() {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({ maKh: '', tenKh: '', diaChi: '', dt: '', cmnd: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const KH_API_URL = `${API_URL}/api/khach-hang`;

  const fetchCustomers = async () => {
    try {
      const response = await fetch(KH_API_URL);
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch (error) {
      console.log('Chưa kết nối Backend Khách hàng');
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${KH_API_URL}/${formData.maKh}` : KH_API_URL;
    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        showMessage(isEditing ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'success');
        setFormData({ maKh: '', tenKh: '', diaChi: '', dt: '', cmnd: '' });
        setIsEditing(false);
        fetchCustomers();
      } else {
        const err = await response.text();
        showMessage(`Lỗi: ${err}`, 'error');
      }
    } catch (error) { 
      showMessage('Lỗi kết nối Server', 'error'); 
    }
  };

  const handleEditClick = (kh) => { 
    setFormData(kh); 
    setIsEditing(true); 
  };

  const handleDeactivate = async (maKh) => {
    if (!window.confirm('Bạn có chắc chắn muốn ngừng dịch vụ khách hàng này?')) return;
    try {
      const response = await fetch(`${KH_API_URL}/${maKh}/ngung-dich-vu`, { method: 'PATCH' });
      if (response.ok) {
        showMessage('Ngừng dịch vụ thành công!', 'success');
        fetchCustomers();
      } else {
        const err = await response.text();
        showMessage(err || 'Không thể khóa khách hàng (có thể do nợ cước)', 'error');
      }
    } catch (error) { 
      showMessage('Lỗi kết nối', 'error'); 
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  return (
    <div className="card" style={{ width: '100%', boxSizing: 'border-box' }}>
      <h2>3. Quản Lý Khách Hàng</h2>
      
      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
        <div className="form-group"><label>Mã KH</label><input className="input-field" type="text" name="maKh" placeholder="Mã KH (VD: KH001)" value={formData.maKh} onChange={handleChange} disabled={isEditing} required /></div>
        <div className="form-group"><label>Họ và Tên</label><input className="input-field" type="text" name="tenKh" placeholder="Nhập tên..." value={formData.tenKh} onChange={handleChange} required /></div>
        <div className="form-group"><label>Địa chỉ</label><input className="input-field" type="text" name="diaChi" placeholder="Nhập địa chỉ..." value={formData.diaChi} onChange={handleChange} required /></div>
        <div className="form-group"><label>Số điện thoại</label><input className="input-field" type="text" name="dt" placeholder="Nhập SĐT..." value={formData.dt} onChange={handleChange} required /></div>
        <div className="form-group"><label>Số CMND/CCCD</label><input className="input-field" type="text" name="cmnd" placeholder="Nhập CMND..." value={formData.cmnd} onChange={handleChange} /></div>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', paddingBottom: '10px' }}>
           <button type="submit" className="btn btn-primary">{isEditing ? 'Cập Nhật' : 'Thêm Khách Hàng'}</button>
           {isEditing && <button type="button" onClick={() => {setFormData({ maKh: '', tenKh: '', diaChi: '', dt: '', cmnd: '' }); setIsEditing(false);}} className="btn alert-error">Hủy</button>}
        </div>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
        <thead>
          <tr style={{ background: '#f4f4f9', textAlign: 'left' }}>
            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Mã KH</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Tên KH</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Địa chỉ</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>SĐT</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
             <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Chưa có dữ liệu</td></tr>
          ) : (
            customers.map(kh => (
              <tr key={kh.maKh} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}><b>{kh.maKh}</b></td>
                <td style={{ padding: '10px' }}>{kh.tenKh}</td>
                <td style={{ padding: '10px' }}>{kh.diaChi}</td>
                <td style={{ padding: '10px' }}>{kh.dt}</td>
                <td style={{ padding: '10px' }}>
                  <button onClick={() => handleEditClick(kh)} style={{ background: '#ffc107', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}>Sửa</button>
                  <button onClick={() => handleDeactivate(kh.maKh)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Khóa</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;