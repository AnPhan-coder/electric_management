import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const API_URL = 'http://localhost:8080';

import TheoDoiNoSection from './components/TheoDoiNoSection';
import KhachHangSection from './components/KhachHangSection';

const TABS = { HIEN_TAI: 'hien_tai', LICH_SU: 'lich_su' };

function formatCurrency(value) {
  if (value === null || value === undefined) return '—';
  return Number(value).toLocaleString('vi-VN') + ' đ/kWh';
}

function formatDateTime(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function SearchableDropdown({ items, displayKey, valueKey, value, onSelect, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredItems = items.filter(item =>
    String(item[displayKey] || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(item[valueKey] || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedItem = items.find(item => item[valueKey] === value);
  const displayText = selectedItem ? `${selectedItem[valueKey]} - ${selectedItem[displayKey]}` : searchTerm;

  return (
    <div className="searchable-select" ref={wrapperRef}>
      <input
        className="input-field"
        type="text"
        placeholder={placeholder}
        value={isOpen ? searchTerm : displayText}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
          if (!e.target.value) onSelect('');
        }}
        onClick={() => {
          setSearchTerm('');
          setIsOpen(true);
        }}
      />
      {isOpen && (
        <ul className="select-dropdown">
          {filteredItems.map(item => (
            <li key={item[valueKey]} onClick={() => {
              onSelect(item[valueKey]);
              setIsOpen(false);
            }}>
              <strong>{item[valueKey]}</strong> - {item[displayKey]}
            </li>
          ))}
          {filteredItems.length === 0 && <li className="no-data">Không tìm thấy dữ liệu phù hợp</li>}
        </ul>
      )}
    </div>
  );
}

function App() {
  const [currentMenu, setCurrentMenu] = useState('dienke');

  const renderContent = () => {
    switch (currentMenu) {
      case 'khachhang': return <KhachHangSection />;
      case 'dienke': return <DienKeSection />;
      case 'hoadon': return <HoaDonSection />;
      case 'theodoino': return <TheoDoiNoSection />;
      case 'giadien': return <BangGiaDienSection />;
      default: return <DienKeSection />;
    }
  };

  const getMenuTitle = () => {
    switch (currentMenu) {
      case 'khachhang': return 'Quản Lý Khách Hàng';
      case 'dienke': return 'Quản Lý Điện Kế';
      case 'hoadon': return 'Chốt Số & Tính Tiền';
      case 'theodoino': return 'Theo Dõi Công Nợ';
      case 'giadien': return 'Bảng Giá & Lịch Sử';
      default: return 'Quản Lý Tính Tiền Điện';
    }
  }

  return (
    <div className="app-container">
      <div className="sidebar">
        <h1 className="app-title">
          <span className="logo-icon">⚡</span> Quản Lý Điện
        </h1>
        <div className="sidebar-nav">
          <button className={`nav-item ${currentMenu === 'khachhang' ? 'nav-item--active' : ''}`} onClick={() => setCurrentMenu('khachhang')}>Khách Hàng</button>
          <button className={`nav-item ${currentMenu === 'dienke' ? 'nav-item--active' : ''}`} onClick={() => setCurrentMenu('dienke')}>Điện Kế</button>
          <button className={`nav-item ${currentMenu === 'hoadon' ? 'nav-item--active' : ''}`} onClick={() => setCurrentMenu('hoadon')}>Chốt Số Hóa Đơn</button>
          <button className={`nav-item ${currentMenu === 'theodoino' ? 'nav-item--active' : ''}`} onClick={() => setCurrentMenu('theodoino')}>Theo Dõi Nợ</button>
          <button className={`nav-item ${currentMenu === 'giadien' ? 'nav-item--active' : ''}`} onClick={() => setCurrentMenu('giadien')}>Bảng Giá & Lịch Sử</button>
        </div>
      </div>

      <div className="main-content">
        <div className="main-wrapper">
          <h2 className="page-title">{getMenuTitle()}</h2>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

function DienKeSection() {
  const [dienKe, setDienKe] = useState({
    madk: '', makh: '', diachi: '', ngaysx: '', ngaylap: '', mota: '', trangthai: true
  });
  const [dsKhachHang, setDsKhachHang] = useState([]);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/khachhang`)
      .then(res => res.json())
      .then(data => setDsKhachHang(data))
      .catch(err => console.log("Lỗi tải DS Khách hàng:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDienKe({ ...dienKe, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSelectKhachHang = (makh) => {
    setDienKe({ ...dienKe, makh: makh });
  };

  const selectedCustomer = dsKhachHang.find(kh => kh.makh === dienKe.makh);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dienKe.makh) {
      setMessage("❌ Vui lòng chọn Khách Hàng từ danh sách!");
      setIsError(true);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/dienke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dienKe),
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
      <form onSubmit={handleSubmit}>
        <div className="grid-form">
          <div className="form-group">
            <label>Mã điện kế (8 số)</label>
            <input className="input-field" type="text" name="madk" placeholder="VD: 12345678" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Chọn Khách Hàng</label>
            <SearchableDropdown
              items={dsKhachHang}
              displayKey="tenkh"
              valueKey="makh"
              value={dienKe.makh}
              onSelect={handleSelectKhachHang}
              placeholder="Nhập mã hoặc tên KH để tìm..."
            />
          </div>

          {selectedCustomer && (
            <div className="customer-info-card">
              <h4 style={{ gridColumn: '1 / -1' }}>👤 Thông tin khách hàng</h4>
              <p><strong>Họ tên:</strong> {selectedCustomer.tenkh}</p>
              <p><strong>Điện thoại:</strong> {selectedCustomer.dt}</p>
              <p><strong>CMND/CCCD:</strong> {selectedCustomer.cmnd}</p>
              <p><strong>Thường trú:</strong> {selectedCustomer.diachi}</p>
            </div>
          )}

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>📍 Địa chỉ lắp đặt Điện kế</label>
            <input className="input-field" type="text" name="diachi" placeholder="Nhập địa chỉ nhà trọ, xưởng, công ty..." onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Ngày sản xuất</label>
            <input className="input-field" type="datetime-local" name="ngaysx" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Ngày lắp đặt</label>
            <input className="input-field" type="datetime-local" name="ngaylap" onChange={handleChange} required />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Mô tả thêm</label>
            <input className="input-field" type="text" name="mota" placeholder="Nhập mô tả..." onChange={handleChange} required />
          </div>
        </div>
        <div style={{ marginTop: '25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label className="checkbox-group">
            <input type="checkbox" name="trangthai" checked={dienKe.trangthai} onChange={handleChange} />
            Hoạt động bình thường
          </label>
          <button type="submit" className="btn btn-primary">Lưu Điện Kế</button>
        </div>
      </form>
      {message && (
        <div className={`alert ${isError ? 'alert-error' : 'alert-success'}`}>{message}</div>
      )}
    </div>
  );
}

function HoaDonSection() {
  const [reqData, setReqData] = useState({ madk: '', chisocuoi: '', denngay: '' });
  const [dsDienKe, setDsDienKe] = useState([]);
  const [dsKhachHang, setDsKhachHang] = useState([]);
  const [chiSoDau, setChiSoDau] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Lấy thời gian hiện tại chuẩn Local time để giới hạn lịch chặn tương lai
  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };
  const maxDateTime = getCurrentDateTime();

  useEffect(() => {
    fetch(`${API_URL}/dienke`)
      .then(res => res.json())
      .then(data => setDsDienKe(data))
      .catch(err => console.log("Lỗi tải DS Điện kế:", err));

    fetch(`${API_URL}/khachhang`)
      .then(res => res.json())
      .then(data => setDsKhachHang(data))
      .catch(err => console.log("Lỗi tải DS Khách hàng:", err));
  }, []);

  const handleChange = (e) => {
    setReqData({ ...reqData, [e.target.name]: e.target.value });
  };

  const handleSelectDienKe = async (madk) => {
    setReqData({ ...reqData, madk: madk });
    if (!madk) {
      setChiSoDau(0);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/hoadon/chisodau/${madk}`);
      if (res.ok) {
        const csd = await res.json();
        setChiSoDau(csd);
      }
    } catch (error) {
      console.log("Lỗi lấy chỉ số đầu:", error);
    }
  };

  const selectedDk = dsDienKe.find(dk => dk.madk === reqData.madk);
  const selectedCustomer = selectedDk ? dsKhachHang.find(kh => kh.makh === selectedDk.makh) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError('');

    if (!reqData.madk) {
      setError("❌ Vui lòng chọn Điện Kế!");
      return;
    }
    if (parseInt(reqData.chisocuoi) <= chiSoDau) {
      setError(`❌ Chỉ số cuối (${reqData.chisocuoi}) phải lớn hơn chỉ số đầu (${chiSoDau})!`);
      return;
    }
    // Logic chặn chốt số ở tương lai (Check double)
    if (new Date(reqData.denngay) > new Date()) {
      setError("❌ Lỗi: Ngày chốt số không được vượt quá ngày giờ hiện tại!");
      return;
    }

    try {
      const payload = {
        madk: reqData.madk,
        chisocuoi: parseInt(reqData.chisocuoi),
        denngay: reqData.denngay,
      };
      const response = await fetch(`${API_URL}/hoadon/tinhtien`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
      <form onSubmit={handleSubmit}>
        <div className="grid-form">
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Chọn Mã điện kế</label>
            <SearchableDropdown
              items={dsDienKe}
              displayKey="diachi"
              valueKey="madk"
              value={reqData.madk}
              onSelect={handleSelectDienKe}
              placeholder="Nhập mã Điện kế hoặc Địa chỉ để tìm..."
            />
          </div>

          {selectedDk && (
            <div className="customer-info-card" style={{ marginBottom: '15px', display: 'flex', gap: '25px', gridColumn: '1 / -1' }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ borderBottom: '1px dashed #bfdbfe', paddingBottom: '8px', marginBottom: '10px', gridColumn: 'unset' }}>⚡ Thông tin Điện Kế</h4>
                <p style={{ marginBottom: '5px' }}><strong>Mã ĐK:</strong> {selectedDk.madk}</p>
                <p><strong>Địa chỉ:</strong> {selectedDk.diachi || selectedDk.mota}</p>
              </div>
              <div style={{ flex: 1, borderLeft: '1px solid #bfdbfe', paddingLeft: '25px' }}>
                <h4 style={{ borderBottom: '1px dashed #bfdbfe', paddingBottom: '8px', marginBottom: '10px', gridColumn: 'unset' }}>👤 Khách hàng sở hữu</h4>
                <p style={{ marginBottom: '5px' }}><strong>Họ tên:</strong> {selectedCustomer?.tenkh || 'Đang tải...'}</p>
                <p><strong>Điện thoại:</strong> {selectedCustomer?.dt || '---'}</p>
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Chỉ số đầu (Tự động)</label>
            <input
              className="input-field input-readonly"
              type="text"
              value={reqData.madk ? `${chiSoDau} kWh` : '---'}
              readOnly
              disabled
            />
          </div>

          <div className="form-group">
            <label>Chỉ số cuối (Chốt số)</label>
            <input className="input-field" type="number" name="chisocuoi" placeholder={`Phải lớn hơn ${chiSoDau}...`} onChange={handleChange} required />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Ngày chốt số (Đến ngày)</label>
            <input
              className="input-field"
              type="datetime-local"
              name="denngay"
              max={maxDateTime} /* Chặn chọn ngày tương lai trên trình duyệt */
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div style={{ marginTop: '25px', textAlign: 'right' }}>
          <button type="submit" className="btn btn-primary">Thực thi Tính Tiền</button>
        </div>
      </form>

      {error && <div className="alert alert-error">{error}</div>}

      {result && (
        <div className="bill-result">
          <h3>✅ Lập Hóa Đơn Thành Công</h3>
          <p>Mã Hóa Đơn: <strong>{result.mahd}</strong></p>
          <p>Kỳ thanh toán: <strong>{result.ky}</strong></p>
          <p>Chỉ số đầu / cuối: <strong>{result.chisodau} / {result.chisocuoi}</strong></p>
          <p className="total-amount">
            Tổng thành tiền:
            <span>{result.tongthanhtien.toLocaleString('vi-VN')} VNĐ</span>
          </p>
        </div>
      )}
    </div>
  );
}

function BangGiaDienSection() {
  const [activeTab, setActiveTab] = useState(TABS.HIEN_TAI);

  return (
    <div className="card">
      <div className="tab-bar">
        <button
          className={`tab-btn ${activeTab === TABS.HIEN_TAI ? 'tab-btn--active' : ''}`}
          onClick={() => setActiveTab(TABS.HIEN_TAI)}
        >
          Bảng Giá Hiện Tại
        </button>
        <button
          className={`tab-btn ${activeTab === TABS.LICH_SU ? 'tab-btn--active' : ''}`}
          onClick={() => setActiveTab(TABS.LICH_SU)}
        >
          Lịch Sử Giá Điện
        </button>
      </div>

      <div className="tab-panel">
        {activeTab === TABS.HIEN_TAI && <TabGiaHienTai />}
        {activeTab === TABS.LICH_SU && <TabLichSuGia />}
      </div>
    </div>
  );
}

function TabGiaHienTai() {
  const [bangGia, setBangGia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/giadien`)
      .then(res => res.json())
      .then(data => { setBangGia(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (bangGia.length === 0) return <div>Chưa có dữ liệu bảng giá.</div>;

  return (
    <div className="table-wrapper">
      <table className="price-table">
        <thead>
          <tr>
            <th>Bậc</th><th>Tên bậc</th><th>Từ (kWh)</th><th>Đến (kWh)</th><th>Đơn giá (đ)</th><th>Ngày áp dụng</th>
          </tr>
        </thead>
        <tbody>
          {bangGia.map((bac) => (
            <tr key={bac.mabac}>
              <td>{bac.mabac}</td>
              <td>{bac.tenbac}</td>
              <td>{bac.tusokw}</td>
              <td>{bac.densokw ?? '∞'}</td>
              <td style={{ color: '#059669', fontWeight: 'bold' }}>{formatCurrency(bac.dongia)}</td>
              <td>{formatDateTime(bac.ngayapdung)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TabLichSuGia() {
  return <div>Đang xây dựng tính năng lịch sử...</div>;
}

export default App;