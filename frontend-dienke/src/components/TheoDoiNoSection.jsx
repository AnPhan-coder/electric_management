import React, { useState, useEffect, useCallback } from 'react';

const API_URL = 'http://localhost:8080';

function formatCurrency(value) {
  if (value === null || value === undefined) return '—';
  return Number(value).toLocaleString('vi-VN') + ' đ';
}

function formatDateTime(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function TheoDoiNoSection() {
  const [dsNo, setDsNo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchDanhSachNo = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/hoadon/no`);
      if (res.ok) {
        const data = await res.json();
        setDsNo(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDanhSachNo();
  }, [fetchDanhSachNo]);

  const handleThanhToan = async (mahd) => {
    if (!window.confirm(`Xác nhận thanh toán cho Hóa Đơn ${mahd}?`)) return;
    try {
      const res = await fetch(`${API_URL}/hoadon/${mahd}/thanhtoan`, { method: 'PUT' });
      if (res.ok) {
        setMessage({ type: 'success', text: `Thanh toán Hóa đơn ${mahd} thành công` });
        fetchDanhSachNo();
      } else {
        const errText = await res.text();
        setMessage({ type: 'error', text: `Lỗi: ${errText}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Lỗi kết nối: ${error.message}` });
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button className="btn btn-edit" onClick={fetchDanhSachNo}>Làm mới danh sách</button>
      </div>

      {message && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="state-loading">Đang tải danh sách nợ...</div>
      ) : dsNo.length === 0 ? (
        <div className="state-empty" style={{ backgroundColor: 'var(--bg-success)', color: 'var(--text-success)' }}>
          Không có hóa đơn nào đang nợ.
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="price-table">
            <thead>
              <tr>
                <th>Mã HĐ</th>
                <th>Kỳ</th>
                <th>T.Gian Chốt</th>
                <th>Chỉ số (Đầu - Cuối)</th>
                <th>Tổng Tiền</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {dsNo.map(hd => (
                <tr key={hd.mahd} style={{ backgroundColor: 'var(--bg-error)' }}>
                  <td className="cell-center"><strong>{hd.mahd}</strong></td>
                  <td className="cell-center">{hd.ky}</td>
                  <td className="cell-date">{formatDateTime(hd.ngaylaphd)}</td>
                  <td className="cell-center">{hd.chisodau} - {hd.chisocuoi}</td>
                  <td className="cell-price">
                    <span className="price-value" style={{ color: 'var(--danger-color)' }}>
                      {formatCurrency(hd.tongthanhtien)}
                    </span>
                  </td>
                  <td className="cell-center">
                    <button className="btn btn-success" onClick={() => handleThanhToan(hd.mahd)} style={{ padding: '6px 12px' }}>
                      Thanh Toán
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
