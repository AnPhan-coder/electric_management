import React, { useState } from 'react';
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
    </div>
  );
}

function DienKeSection() {
  const [dienKe, setDienKe] = useState({
    madk: '', makh: '', ngaysx: '', ngaylap: '', mota: '', trangthai: true
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDienKe({
      ...dienKe,
      [name]: type === 'checkbox' ? checked : value
    });
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
        <div className="form-group">
          <label>Mã điện kế (8 số)</label>
          <input className="input-field" type="text" name="madk" placeholder="VD: 12345678" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Mã khách hàng</label>
          <input className="input-field" type="text" name="makh" placeholder="Nhập mã KH..." onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Ngày sản xuất</label>
          <input className="input-field" type="datetime-local" name="ngaysx" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Ngày lắp đặt</label>
          <input className="input-field" type="datetime-local" name="ngaylap" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Mô tả</label>
          <input className="input-field" type="text" name="mota" placeholder="Nhập mô tả..." onChange={handleChange} required />
        </div>

        <label className="checkbox-group">
          <input type="checkbox" name="trangthai" checked={dienKe.trangthai} onChange={handleChange} />
          Hoạt động bình thường
        </label>

        <button type="submit" className="btn btn-success">Lưu Điện Kế</button>
      </form>

      {message && (
        <div className={`alert ${isError ? 'alert-error' : 'alert-success'}`}>
          {message}
        </div>
      )}
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
      const payload = {
        madk: reqData.madk,
        chisocuoi: parseInt(reqData.chisocuoi),
        denngay: reqData.denngay
      };

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
        <div className="form-group">
          <label>Mã điện kế</label>
          <input className="input-field" type="text" name="madk" placeholder="Nhập mã ĐK cần tính..." onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Chỉ số cuối</label>
          <input className="input-field" type="number" name="chisocuoi" placeholder="Nhập chỉ số KW chốt cuối tháng..." onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Ngày chốt số (Đến ngày)</label>
          <input className="input-field" type="datetime-local" name="denngay" onChange={handleChange} required />
        </div>

        <button type="submit" className="btn btn-primary">Thực thi Tính Tiền</button>
      </form>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {result && (
        <div className="bill-result">
          <h3>✅ Lập Hóa Đơn Thành Công</h3>
          <p>Mã Hóa Đơn: <strong>{result.mahd}</strong></p>
          <p>Kỳ thanh toán: <strong>{result.ky}</strong></p>
          <p>Chỉ số đầu: <strong>{result.chisodau}</strong></p>
          <p>Chỉ số cuối: <strong>{result.chisocuoi}</strong></p>
          <p className="total-amount">
            Tổng thành tiền:
            <span>{result.tongthanhtien.toLocaleString('vi-VN')} VNĐ</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;