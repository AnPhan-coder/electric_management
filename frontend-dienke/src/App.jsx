import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const API_URL = 'http://localhost:8080';

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS = {
  HIEN_TAI: 'hien_tai',
  LICH_SU: 'lich_su',
};

// ─── Utilities ────────────────────────────────────────────────────────────────

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

// ─── Root App ─────────────────────────────────────────────────────────────────

function App() {
  return (
    <div className="app-container">
      <h1 className="page-title">QUẢN LÝ TIỀN ĐIỆN</h1>

      <div className="grid-container">
        <DienKeSection />
        <HoaDonSection />
      </div>

      <BangGiaDienSection />
    </div>
  );
}

// ─── Section 1: Thêm Điện Kế ─────────────────────────────────────────────────

function DienKeSection() {
  const [dienKe, setDienKe] = useState({
    madk: '', makh: '', ngaysx: '', ngaylap: '', mota: '', trangthai: true
  });
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
        <div className={`alert ${isError ? 'alert-error' : 'alert-success'}`}>{message}</div>
      )}
    </div>
  );
}

// ─── Section 2: Tính Tiền Hóa Đơn ───────────────────────────────────────────

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
      <h2>2. Tính Tiền &amp; Chốt Số Hóa Đơn</h2>
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

      {error && <div className="alert alert-error">{error}</div>}

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

// ─── Section 3: Bảng Giá Điện ────────────────────────────────────────────────

function BangGiaDienSection() {
  const [activeTab, setActiveTab] = useState(TABS.HIEN_TAI);

  return (
    <div className="price-section">
      <div className="price-section-header">
        <h2 className="price-section-title">3. Bảng Giá Điện</h2>
        <div className="tab-bar" role="tablist">
          <button
            role="tab"
            id="tab-hien-tai"
            aria-selected={activeTab === TABS.HIEN_TAI}
            className={`tab-btn ${activeTab === TABS.HIEN_TAI ? 'tab-btn--active' : ''}`}
            onClick={() => setActiveTab(TABS.HIEN_TAI)}
          >
            Bảng Giá Hiện Tại
          </button>
          <button
            role="tab"
            id="tab-lich-su"
            aria-selected={activeTab === TABS.LICH_SU}
            className={`tab-btn ${activeTab === TABS.LICH_SU ? 'tab-btn--active' : ''}`}
            onClick={() => setActiveTab(TABS.LICH_SU)}
          >
            Lịch Sử Giá Điện
          </button>
        </div>
      </div>

      <div className="tab-panel">
        {activeTab === TABS.HIEN_TAI && <TabGiaHienTai />}
        {activeTab === TABS.LICH_SU && <TabLichSuGia />}
      </div>
    </div>
  );
}

// ─── Tab: Bảng Giá Hiện Tại ──────────────────────────────────────────────────

function TabGiaHienTai() {
  const [bangGia, setBangGia] = useState([]);
  const [editValues, setEditValues] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchBangGia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/giadien`);
      if (!res.ok) throw new Error('Không thể tải bảng giá');
      const data = await res.json();
      setBangGia(data);
    } catch (err) {
      setMessage({ type: 'error', text: `❌ ${err.message}` });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBangGia();
  }, [fetchBangGia]);

  const handleStartEdit = () => {
    const initialValues = {};
    bangGia.forEach((bac) => {
      initialValues[bac.mabac] = String(bac.dongia);
    });
    setEditValues(initialValues);
    setIsEditing(true);
    setMessage(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditValues({});
    setMessage(null);
  };

  const handlePriceChange = (mabac, value) => {
    setEditValues((prev) => ({ ...prev, [mabac]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const updates = bangGia.map((bac) => ({
        mabac: bac.mabac,
        dongia: parseFloat(editValues[bac.mabac]),
      }));

      const hasInvalid = updates.some((u) => isNaN(u.dongia) || u.dongia <= 0);
      if (hasInvalid) {
        setMessage({ type: 'error', text: '❌ Đơn giá phải là số dương hợp lệ' });
        return;
      }

      const res = await fetch(`${API_URL}/giadien`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: '✅ Cập nhật bảng giá thành công' });
        setIsEditing(false);
        await fetchBangGia();
      } else {
        const errText = await res.text();
        setMessage({ type: 'error', text: `❌ Lỗi: ${errText}` });
      }
    } catch (err) {
      setMessage({ type: 'error', text: `❌ Lỗi kết nối: ${err.message}` });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="state-loading">Đang tải bảng giá...</div>;
  }

  if (bangGia.length === 0) {
    return <div className="state-empty">Chưa có dữ liệu bảng giá điện.</div>;
  }

  return (
    <div>
      <div className="table-toolbar">
        {!isEditing ? (
          <button id="btn-chinh-sua-gia" className="btn btn-edit" onClick={handleStartEdit}>
            ✏️ Chỉnh Sửa Bảng Giá
          </button>
        ) : (
          <div className="toolbar-actions">
            <button id="btn-luu-gia" className="btn btn-save" onClick={handleSave} disabled={saving}>
              {saving ? 'Đang lưu...' : '💾 Lưu Thay Đổi'}
            </button>
            <button id="btn-huy-gia" className="btn btn-cancel" onClick={handleCancelEdit} disabled={saving}>
              Hủy
            </button>
          </div>
        )}
      </div>

      {message && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          {message.text}
        </div>
      )}

      <div className="table-wrapper">
        <table className="price-table">
          <thead>
            <tr>
              <th>Bậc</th>
              <th>Tên bậc</th>
              <th>Từ (kWh)</th>
              <th>Đến (kWh)</th>
              <th>Đơn giá (đ/kWh)</th>
              <th>Ngày áp dụng</th>
            </tr>
          </thead>
          <tbody>
            {bangGia.map((bac) => (
              <tr key={bac.mabac}>
                <td className="cell-center">{bac.mabac}</td>
                <td>{bac.tenbac}</td>
                <td className="cell-center">{bac.tusokw}</td>
                <td className="cell-center">{bac.densokw ?? '∞'}</td>
                <td className="cell-price">
                  {isEditing ? (
                    <input
                      id={`price-input-bac-${bac.mabac}`}
                      className="input-field input-price"
                      type="number"
                      min="1"
                      step="1"
                      value={editValues[bac.mabac] ?? ''}
                      onChange={(e) => handlePriceChange(bac.mabac, e.target.value)}
                    />
                  ) : (
                    <span className="price-value">{formatCurrency(bac.dongia)}</span>
                  )}
                </td>
                <td className="cell-date">{formatDateTime(bac.ngayapdung)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditing && (
        <p className="edit-hint">
          💡 Chỉ chỉnh sửa cột <strong>Đơn giá</strong>. Sau khi lưu, bảng giá cũ sẽ được tự động lưu vào Lịch Sử.
        </p>
      )}
    </div>
  );
}

// ─── Tab: Lịch Sử Giá Điện ───────────────────────────────────────────────────

function TabLichSuGia() {
  const [phienList, setPhienList] = useState([]);
  const [selectedPhien, setSelectedPhien] = useState(null);
  const [chiTiet, setChiTiet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingChiTiet, setLoadingChiTiet] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPhienList = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/giadien/lichsu`);
        if (!res.ok) throw new Error('Không thể tải lịch sử');
        const data = await res.json();
        setPhienList(data);
      } catch (err) {
        setError(`❌ ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchPhienList();
  }, []);

  const handleSelectPhien = async (phien) => {
    if (selectedPhien?.malichsu === phien.malichsu) {
      setSelectedPhien(null);
      setChiTiet([]);
      return;
    }
    setSelectedPhien(phien);
    setLoadingChiTiet(true);
    try {
      const res = await fetch(`${API_URL}/giadien/lichsu/${phien.malichsu}`);
      if (!res.ok) throw new Error('Không thể tải chi tiết phiên');
      const data = await res.json();
      setChiTiet(data);
    } catch (err) {
      setError(`❌ ${err.message}`);
    } finally {
      setLoadingChiTiet(false);
    }
  };

  if (loading) return <div className="state-loading">Đang tải lịch sử...</div>;

  if (error) return <div className="alert alert-error">{error}</div>;

  if (phienList.length === 0) {
    return (
      <div className="state-empty">
        Chưa có lịch sử thay đổi giá điện.
        <br />
        <span className="state-hint">Lịch sử sẽ xuất hiện sau khi bạn cập nhật và lưu bảng giá.</span>
      </div>
    );
  }

  return (
    <div className="history-layout">
      <div className="history-sidebar">
        <p className="history-sidebar-title">Các phiên thay đổi</p>
        <ul className="history-list" role="list">
          {phienList.map((phien) => (
            <li key={phien.malichsu}>
              <button
                id={`btn-phien-${phien.malichsu}`}
                className={`history-item ${selectedPhien?.malichsu === phien.malichsu ? 'history-item--active' : ''}`}
                onClick={() => handleSelectPhien(phien)}
              >
                <span className="history-item-label">Phiên #{phien.malichsu}</span>
                <span className="history-item-date">{formatDateTime(phien.ngaythaydoi)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="history-detail">
        {!selectedPhien && (
          <div className="state-empty">← Chọn một phiên để xem chi tiết bảng giá cũ</div>
        )}

        {selectedPhien && loadingChiTiet && (
          <div className="state-loading">Đang tải chi tiết...</div>
        )}

        {selectedPhien && !loadingChiTiet && chiTiet.length > 0 && (
          <>
            <div className="history-detail-header">
              <h3 className="history-detail-title">
                Bảng giá cũ — áp dụng đến {formatDateTime(selectedPhien.ngaythaydoi)}
              </h3>
            </div>
            <div className="table-wrapper">
              <table className="price-table">
                <thead>
                  <tr>
                    <th>Bậc</th>
                    <th>Tên bậc</th>
                    <th>Từ (kWh)</th>
                    <th>Đến (kWh)</th>
                    <th>Đơn giá (đ/kWh)</th>
                    <th>Ngày áp dụng</th>
                  </tr>
                </thead>
                <tbody>
                  {chiTiet.map((row) => (
                    <tr key={row.malichsu}>
                      <td className="cell-center">{row.mabac}</td>
                      <td>{row.tenbac}</td>
                      <td className="cell-center">{row.tusokw}</td>
                      <td className="cell-center">{row.densokw ?? '∞'}</td>
                      <td className="cell-price">
                        <span className="price-value price-value--old">{formatCurrency(row.dongia)}</span>
                      </td>
                      <td className="cell-date">{formatDateTime(row.ngayapdung)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;