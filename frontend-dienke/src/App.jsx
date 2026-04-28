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

function formatMoney(value) {
  if (value === null || value === undefined) return '—';
  return Number(value).toLocaleString('vi-VN') + ' đ';
}

function formatDateTime(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
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

  useEffect(() => {
    if (!value) setSearchTerm('');
  }, [value]);

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

// ==========================================
// SECTION 1: ĐIỆN KẾ (Đã thêm Tìm kiếm)
// ==========================================
function DienKeSection() {
  const [dienKe, setDienKe] = useState({
    madk: '', makh: '', diachi: '', ngaysx: '', ngaylap: '', mota: '', trangthai: true
  });
  const [dsKhachHang, setDsKhachHang] = useState([]);
  const [dsDienKeList, setDsDienKeList] = useState([]);

  // STATE MỚI CHO TÍNH NĂNG TÌM KIẾM
  const [searchListTerm, setSearchListTerm] = useState('');

  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const getEndOfTodayDateTime = () => {
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };
  const maxDateTime = getEndOfTodayDateTime();

  const loadDienKeList = () => {
    fetch(`${API_URL}/dienke`)
      .then(res => res.json())
      .then(data => setDsDienKeList(data))
      .catch(err => console.log("Lỗi tải DS Điện kế:", err));
  };

  useEffect(() => {
    fetch(`${API_URL}/khachhang`)
      .then(res => res.json())
      .then(data => setDsKhachHang(data))
      .catch(err => console.log("Lỗi tải DS Khách hàng:", err));

    loadDienKeList();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDienKe({ ...dienKe, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSelectKhachHang = (makh) => {
    setDienKe({ ...dienKe, makh: makh });
  };

  const getKhachHangInfo = (makh) => {
    const kh = dsKhachHang.find(k => k.makh === makh);
    return kh ? kh.tenkh : makh;
  };

  const selectedCustomer = dsKhachHang.find(kh => kh.makh === dienKe.makh);
  const isCustomerLocked = selectedCustomer && selectedCustomer.trangthai === false;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dienKe.makh) {
      setMessage("❌ Vui lòng chọn Khách Hàng từ danh sách!");
      setIsError(true);
      return;
    }

    if (isCustomerLocked) {
      setMessage("❌ Khách hàng đang bị ngưng hoạt động, không thể thêm điện kế!");
      setIsError(true);
      return;
    }

    if (!dienKe.mota || dienKe.mota.trim() === '') {
      setMessage("❌ Mô tả không được để trống!");
      setIsError(true);
      return;
    }

    const sxDate = new Date(dienKe.ngaysx).setHours(0, 0, 0, 0);
    const lapDate = new Date(dienKe.ngaylap).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);

    if (sxDate >= lapDate) {
      setMessage("❌ Ngày sản xuất phải BÉ HƠN ngày lắp đặt!");
      setIsError(true);
      return;
    }

    if (sxDate > today || lapDate > today) {
      setMessage("❌ Ngày sản xuất và Ngày lắp đặt KHÔNG ĐƯỢC LỚN HƠN ngày hiện tại!");
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
        setDienKe({ madk: '', makh: '', diachi: '', ngaysx: '', ngaylap: '', mota: '', trangthai: true });
        loadDienKeList();
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

  const handleToggleStatus = async (dk) => {
    if (!window.confirm(`Bạn có chắc muốn thay đổi trạng thái của điện kế [${dk.madk}] không?`)) return;
    try {
      const response = await fetch(`${API_URL}/dienke/${dk.madk}/trangthai`, {
        method: 'PUT'
      });
      if (response.ok) {
        loadDienKeList();
      } else {
        alert("❌ Lỗi khi cập nhật trạng thái điện kế!");
      }
    } catch (error) {
      alert("❌ Lỗi kết nối: " + error.message);
    }
  };

  // LOGIC LỌC TÌM KIẾM ĐIỆN KẾ
  const filteredDienKeList = dsDienKeList.filter(dk => {
    const searchLower = searchListTerm.toLowerCase();
    const tenKH = getKhachHangInfo(dk.makh).toLowerCase();
    const diaChi = (dk.diachi || dk.mota || '').toLowerCase();

    return (
      dk.madk.toLowerCase().includes(searchLower) ||
      tenKH.includes(searchLower) ||
      diaChi.includes(searchLower)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div className="card">
        <h3 style={{ marginBottom: '25px', color: '#1e293b', fontSize: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px' }}>
          📝 Đăng ký Điện Kế mới
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="grid-form">
            <div className="form-group">
              <label>Mã điện kế (8 số)</label>
              <input className="input-field" type="text" name="madk" placeholder="VD: 12345678" value={dienKe.madk} onChange={handleChange} required />
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
                <p>
                  <strong>Trạng thái: </strong>
                  {selectedCustomer.trangthai === false
                    ? <span style={{ color: '#ef4444', fontWeight: 'bold' }}>🔴 Ngưng hoạt động</span>
                    : <span style={{ color: '#059669', fontWeight: 'bold' }}>🟢 Đang hoạt động</span>}
                </p>
                <p style={{ gridColumn: '1 / -1' }}><strong>Thường trú:</strong> {selectedCustomer.diachi}</p>
              </div>
            )}

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>📍 Địa chỉ lắp đặt Điện kế</label>
              <input className="input-field" type="text" name="diachi" placeholder="Nhập địa chỉ nhà trọ, xưởng, công ty..." value={dienKe.diachi} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Ngày sản xuất</label>
              <input
                className="input-field"
                type="datetime-local"
                name="ngaysx"
                max={maxDateTime}
                value={dienKe.ngaysx}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Ngày lắp đặt</label>
              <input
                className="input-field"
                type="datetime-local"
                name="ngaylap"
                max={maxDateTime}
                value={dienKe.ngaylap}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Mô tả thêm</label>
              <input className="input-field" type="text" name="mota" placeholder="Nhập mô tả..." value={dienKe.mota} onChange={handleChange} required />
            </div>
          </div>
          <div style={{ marginTop: '25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label className="checkbox-group">
              <input type="checkbox" name="trangthai" checked={dienKe.trangthai} onChange={handleChange} />
              Hoạt động bình thường
            </label>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isCustomerLocked}
              style={isCustomerLocked ? { background: '#cbd5e1', color: '#64748b', cursor: 'not-allowed', boxShadow: 'none' } : {}}
            >
              {isCustomerLocked ? '🚫 Khách hàng bị khóa' : 'Lưu Điện Kế'}
            </button>
          </div>
        </form>
        {message && (
          <div className={`alert ${isError ? 'alert-error' : 'alert-success'}`}>{message}</div>
        )}
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: '#1e293b', fontSize: '1.25rem', margin: 0 }}>
            📋 Danh Sách Điện Kế Trạm
          </h3>

          {/* Ô TÌM KIẾM MỚI */}
          <div style={{ width: '320px' }}>
            <input
              type="text"
              className="input-field"
              placeholder="🔍 Tìm mã ĐK, tên KH, địa chỉ..."
              value={searchListTerm}
              onChange={(e) => setSearchListTerm(e.target.value)}
              style={{ padding: '10px 16px', borderRadius: '30px', fontSize: '0.95rem' }}
            />
          </div>
        </div>

        <div className="table-wrapper">
          <table className="price-table">
            <thead>
              <tr>
                <th>Mã ĐK</th>
                <th>Khách hàng sở hữu</th>
                <th>Địa chỉ lắp đặt</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredDienKeList.length > 0 ? filteredDienKeList.map(dk => (
                <tr key={dk.madk}>
                  <td style={{ fontWeight: 'bold', color: '#2563eb' }}>{dk.madk}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#1f2937' }}>{getKhachHangInfo(dk.makh)}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Mã: {dk.makh}</div>
                  </td>
                  <td>{dk.diachi || dk.mota}</td>
                  <td>
                    {dk.trangthai ? (
                      <span className="badge status-active">Hoạt động</span>
                    ) : (
                      <span className="badge status-locked">Tạm ngưng</span>
                    )}
                  </td>
                  <td>
                    <button
                      className={dk.trangthai ? "btn" : "btn-success"}
                      style={{
                        padding: '6px 12px', fontSize: '0.85rem',
                        ...(dk.trangthai ? { backgroundColor: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca' } : {})
                      }}
                      onClick={() => handleToggleStatus(dk)}
                    >
                      {dk.trangthai ? '🔒 Khóa' : '🔓 Mở khóa'}
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="state-empty">
                    {searchListTerm ? 'Không tìm thấy điện kế nào phù hợp với từ khóa.' : 'Chưa có dữ liệu điện kế trong hệ thống.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// SECTION 2: HÓA ĐƠN CHỐT SỐ
// ==========================================
function HoaDonSection() {
  const [reqData, setReqData] = useState({ madk: '', chisocuoi: '', denngay: '' });
  const [dsDienKe, setDsDienKe] = useState([]);
  const [dsKhachHang, setDsKhachHang] = useState([]);

  const [chiSoDau, setChiSoDau] = useState(0);
  const [ngayChotCuoi, setNgayChotCuoi] = useState('');
  const [minDateTime, setMinDateTime] = useState('');

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const getEndOfTodayDateTime = () => {
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };
  const maxDateTime = getEndOfTodayDateTime();

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
    setReqData({ ...reqData, madk: madk, denngay: '' });
    if (!madk) {
      setChiSoDau(0);
      setNgayChotCuoi('');
      setMinDateTime('');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/hoadon/thongtin-ky-truoc/${madk}`);
      if (res.ok) {
        const data = await res.json();
        setChiSoDau(data.chisodau || 0);

        if (data.ngaychotcuoi) {
          setNgayChotCuoi(data.ngaychotcuoi);

          const dateObj = new Date(data.ngaychotcuoi);
          dateObj.setDate(dateObj.getDate() + 1);
          dateObj.setHours(0, 0, 0, 0);
          dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset());
          setMinDateTime(dateObj.toISOString().slice(0, 16));
        } else {
          setNgayChotCuoi('');
          setMinDateTime('');
        }
      }
    } catch (error) {
      console.log("Lỗi lấy thông tin kỳ trước:", error);
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

    const chotDate = new Date(reqData.denngay).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);

    if (chotDate > today) {
      setError("❌ Lỗi: Ngày chốt số không được vượt quá ngày hiện tại!");
      return;
    }

    if (ngayChotCuoi) {
      const cuoiDate = new Date(ngayChotCuoi).setHours(0, 0, 0, 0);
      if (chotDate <= cuoiDate) {
        setError(`❌ Lỗi: Ngày chốt số mới phải LỚN HƠN ngày kỳ trước (${formatDateTime(ngayChotCuoi)})!`);
        return;
      }
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

        setChiSoDau(data.chisocuoi);
        setNgayChotCuoi(data.denngay);

        const dateObj = new Date(data.denngay);
        dateObj.setDate(dateObj.getDate() + 1);
        dateObj.setHours(0, 0, 0, 0);
        dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset());
        setMinDateTime(dateObj.toISOString().slice(0, 16));

        setReqData({ ...reqData, chisocuoi: '', denngay: '' });
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
            <label>Chỉ số đầu kỳ (Tự động)</label>
            <input
              className="input-field input-readonly"
              type="text"
              value={reqData.madk ? `${chiSoDau} kWh` : '---'}
              readOnly
              disabled
            />
            {ngayChotCuoi && (
              <small style={{ color: '#059669', marginTop: '5px', fontWeight: 600 }}>
                Kỳ trước: {formatDateTime(ngayChotCuoi)}
              </small>
            )}
          </div>

          <div className="form-group">
            <label>Chỉ số cuối (Chốt số mới)</label>
            <input className="input-field" type="number" name="chisocuoi" value={reqData.chisocuoi} placeholder={`Phải lớn hơn ${chiSoDau}...`} onChange={handleChange} required />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Ngày chốt số (Đến ngày)</label>
            <input
              className="input-field"
              type="datetime-local"
              name="denngay"
              value={reqData.denngay}
              min={minDateTime}
              max={maxDateTime}
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
          <div className="bill-header">
            <h3>✅ Lập Hóa Đơn Thành Công</h3>
            <span className="bill-badge">Đã chốt số</span>
          </div>

          <div className="bill-body">
            <div className="bill-info-panel">
              <div className="bill-info-row">
                <span className="bill-info-label">Mã Hóa Đơn:</span>
                <span className="bill-info-value">{result.mahd}</span>
              </div>
              <div className="bill-info-row">
                <span className="bill-info-label">Kỳ thanh toán:</span>
                <span className="bill-info-value">{result.ky}</span>
              </div>
              <div className="bill-info-row">
                <span className="bill-info-label">Chỉ số (Đầu - Cuối):</span>
                <span className="bill-info-value">{result.chisodau} <span style={{ color: '#94a3b8', margin: '0 5px' }}>→</span> {result.chisocuoi}</span>
              </div>
              <div className="bill-info-row">
                <span className="bill-info-label">Tổng tiêu thụ:</span>
                <span className="bill-info-value text-blue">{result.chisocuoi - result.chisodau} <small style={{ fontWeight: 500 }}>kWh</small></span>
              </div>
            </div>

            <div className="bill-table-panel">
              <div className="bill-table-header">
                📊 Phân tích tiền điện theo bậc thang
              </div>
              <table className="bill-table">
                <thead>
                  <tr>
                    <th className="text-left">Bậc</th>
                    <th className="text-center">Số lượng</th>
                    <th className="text-right">Đơn giá</th>
                    <th className="text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {result.chiTiet && result.chiTiet.length > 0 ? (
                    result.chiTiet.map((ct, idx) => (
                      <tr key={idx}>
                        <td className="text-left fw-bold">Bậc {ct.id.mabac}</td>
                        <td className="text-center">{ct.dntt}</td>
                        <td className="text-right">{formatMoney(ct.dongia)}</td>
                        <td className="text-right text-green">{formatMoney(ct.dntt * ct.dongia)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center" style={{ padding: '20px', color: '#94a3b8', fontStyle: 'italic' }}>
                        Chưa có dữ liệu chi tiết.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bill-footer">
            <div className="total-box">
              <span className="total-label">Tổng thành tiền (Chưa VAT):</span>
              <span className="total-value">{formatMoney(result.tongthanhtien)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// SECTION 3: BẢNG GIÁ ĐIỆN
// ==========================================
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
  const [isAdding, setIsAdding] = useState(false);
  const [newTier, setNewTier] = useState({ densokwBacHienTai: '', dongiaBacMoi: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({});
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const loadBangGia = () => {
    setLoading(true);
    fetch(`${API_URL}/giadien`)
      .then(res => res.json())
      .then(data => { setBangGia(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  };

  useEffect(() => {
    loadBangGia();
  }, []);

  const toggleEdit = () => {
    if (!isEditing) {
      const initialValues = {};
      bangGia.forEach(b => { initialValues[b.mabac] = b.dongia; });
      setEditValues(initialValues);
    }
    setIsEditing(!isEditing);
  };

  const handleSaveEdit = async () => {
    if (!window.confirm("Chốt lưu bảng giá mới? Bảng cũ sẽ được tự động lưu vào Lịch sử.")) return;
    setMessage('');
    setIsError(false);
    try {
      const updates = Object.keys(editValues).map(mabac => ({
        mabac: parseInt(mabac),
        dongia: parseFloat(editValues[mabac])
      }));
      const response = await fetch(`${API_URL}/giadien`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        setMessage("✅ Cập nhật đơn giá thành công!");
        setIsError(false);
        setIsEditing(false);
        loadBangGia();
      } else {
        const errorText = await response.text();
        setMessage(`❌ Lỗi: ${errorText}`);
        setIsError(true);
      }
    } catch (err) {
      setMessage(`❌ Lỗi kết nối: ${err.message}`);
      setIsError(true);
    }
  };

  const handleDelete = async (mabac) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa Bậc ${mabac} không?`)) return;
    setMessage('');
    setIsError(false);
    try {
      const response = await fetch(`${API_URL}/giadien/${mabac}`, { method: 'DELETE' });
      if (response.ok) {
        setMessage("✅ Xóa bậc thành công!");
        setIsError(false);
        loadBangGia();
      } else {
        const errorText = await response.text();
        setMessage(`❌ Không thể xóa: ${errorText}`);
        setIsError(true);
      }
    } catch (error) {
      setMessage(`❌ Lỗi kết nối: ${error.message}`);
      setIsError(true);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm(`Bạn có chắc chắn muốn phát sinh thêm bậc mới không?\nBảng giá cũ hiện tại sẽ được lưu vào Lịch sử.`)) return;
    setMessage('');
    setIsError(false);

    try {
      const payload = {
        densokwBacHienTai: parseInt(newTier.densokwBacHienTai),
        dongiaBacMoi: parseFloat(newTier.dongiaBacMoi)
      };

      const response = await fetch(`${API_URL}/giadien/them-bac`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setMessage("✅ Thêm bậc mới thành công!");
        setIsError(false);
        setIsAdding(false);
        setNewTier({ densokwBacHienTai: '', dongiaBacMoi: '' });
        loadBangGia();
      } else {
        const errorText = await response.text();
        setMessage(`❌ Lỗi thêm bậc: ${errorText}`);
        setIsError(true);
      }
    } catch (error) {
      setMessage(`❌ Lỗi kết nối: ${error.message}`);
      setIsError(true);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (bangGia.length === 0) return <div>Chưa có dữ liệu bảng giá.</div>;

  const highestTier = bangGia[bangGia.length - 1];

  return (
    <div className="table-wrapper">
      {message && (
        <div className={`alert ${isError ? 'alert-error' : 'alert-success'}`} style={{ marginBottom: '15px' }}>
          {message}
        </div>
      )}
      <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>Bảng Giá Hiện Tại</h3>
        <div>
          {!isEditing ? (
            <button className="btn" onClick={toggleEdit}>✏️ Sửa Đơn Giá</button>
          ) : (
            <>
              <button className="btn" style={{ marginRight: '10px' }} onClick={toggleEdit}>Hủy</button>
              <button className="btn btn-primary" onClick={handleSaveEdit}>💾 Lưu Thay Đổi</button>
            </>
          )}
        </div>
      </div>
      <table className="price-table">
        <thead>
          <tr>
            <th>Bậc</th><th>Tên bậc</th><th>Từ (kWh)</th><th>Đến (kWh)</th><th>Đơn giá (đ)</th><th>Ngày áp dụng</th><th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {bangGia.map((bac) => (
            <tr key={bac.mabac}>
              <td>{bac.mabac}</td>
              <td>{bac.tenbac}</td>
              <td>{bac.tusokw}</td>
              <td>{bac.densokw ?? '∞'}</td>
              <td style={{ color: '#059669', fontWeight: 'bold' }}>
                {isEditing ? (
                  <input
                    type="number"
                    className="input-field"
                    value={editValues[bac.mabac] ?? ''}
                    onChange={e => setEditValues({ ...editValues, [bac.mabac]: e.target.value })}
                    style={{ width: '120px', padding: '4px 8px', margin: 0 }}
                  />
                ) : formatCurrency(bac.dongia)}
              </td>
              <td>{formatDateTime(bac.ngayapdung)}</td>
              <td>
                {bac.mabac === highestTier.mabac && bangGia.length > 1 && !isEditing && (
                  <button className="btn" style={{ padding: '4px 10px', fontSize: '13px', backgroundColor: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca' }} onClick={() => handleDelete(bac.mabac)}>🗑 Xóa</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!isAdding ? (
        <div style={{ marginTop: '15px', textAlign: 'right' }}>
          <button className="btn btn-primary" onClick={() => setIsAdding(true)}>+ Thêm Bậc Mới</button>
        </div>
      ) : (
        <div className="card" style={{ marginTop: '20px', border: '1px dashed #3b82f6', backgroundColor: '#eff6ff', boxShadow: 'none' }}>
          <h4 style={{ marginBottom: '10px', color: '#1e40af' }}>✨ Khởi tạo Bậc {highestTier.mabac + 1} mới</h4>
          <form onSubmit={handleAddSubmit} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
              <label>Khép cận trên cho Bậc {highestTier.mabac} (kWh)</label>
              <input
                className="input-field"
                type="number"
                required
                placeholder={`Lớn hơn ${highestTier.tusokw}`}
                value={newTier.densokwBacHienTai}
                onChange={(e) => setNewTier({ ...newTier, densokwBacHienTai: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
              <label>Đơn giá cho Bậc {highestTier.mabac + 1} mới (đ/kWh)</label>
              <input
                className="input-field"
                type="number"
                required
                placeholder="VD: 3500"
                value={newTier.dongiaBacMoi}
                onChange={(e) => setNewTier({ ...newTier, dongiaBacMoi: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" className="btn" onClick={() => setIsAdding(false)}>Hủy</button>
              <button type="submit" className="btn btn-primary">Lưu Bậc</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function TabLichSuGia() {
  const [phienList, setPhienList] = useState([]);
  const [selectedPhien, setSelectedPhien] = useState(null);
  const [chiTiet, setChiTiet] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/giadien/lichsu`)
      .then(res => res.json())
      .then(data => { setPhienList(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const handleSelectPhien = (malichsu) => {
    fetch(`${API_URL}/giadien/lichsu/${malichsu}`)
      .then(res => res.json())
      .then(data => {
        setSelectedPhien(malichsu);
        setChiTiet(data);
      })
      .catch(err => console.error(err));
  };

  if (loading) return <div>Đang tải...</div>;
  if (phienList.length === 0) return <div>Chưa có dữ liệu lịch sử thay đổi bảng giá.</div>;

  return (
    <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
      <div style={{ flex: '1', borderRight: '1px solid #e2e8f0', paddingRight: '15px' }}>
        <h4 style={{ marginBottom: '15px' }}>⏱ Các lần thay đổi giá</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {phienList.map(phien => (
            <div
              key={phien.malichsu}
              onClick={() => handleSelectPhien(phien.malichsu)}
              style={{
                padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px',
                cursor: 'pointer', backgroundColor: selectedPhien === phien.malichsu ? '#eff6ff' : '#fff',
                borderColor: selectedPhien === phien.malichsu ? '#3b82f6' : '#cbd5e1'
              }}
            >
              <div style={{ fontWeight: 'bold', color: '#1e293b' }}>Cập nhật lúc:</div>
              <div style={{ color: '#475569', fontSize: '14px', marginTop: '4px' }}>{formatDateTime(phien.ngaythaydoi)}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: '2', paddingLeft: '5px' }}>
        {!selectedPhien ? (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
            ← Chọn một mốc thay đổi bên trái để xem chi tiết
          </div>
        ) : (
          <div>
            <h4 style={{ marginBottom: '15px', color: '#1e293b' }}>Chi tiết Bảng giá cũ</h4>
            <div className="table-wrapper">
              <table className="price-table">
                <thead>
                  <tr>
                    <th>Bậc</th><th>Từ (kWh)</th><th>Đến (kWh)</th><th>Đơn giá cũ (đ)</th><th>Ngày áp dụng</th>
                  </tr>
                </thead>
                <tbody>
                  {chiTiet.map(bac => (
                    <tr key={bac.malichsu}>
                      <td>Bậc {bac.mabac}</td>
                      <td>{bac.tusokw}</td>
                      <td>{bac.densokw ?? '∞'}</td>
                      <td style={{ color: '#64748b', textDecoration: 'line-through' }}>{formatCurrency(bac.dongia)}</td>
                      <td>{formatDateTime(bac.ngayapdung)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;