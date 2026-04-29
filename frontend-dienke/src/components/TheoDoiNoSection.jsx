import React, { useState, useEffect, useCallback } from 'react';

const API_URL = 'http://localhost:8080';

// Hàm định dạng tiền tệ
function formatCurrency(value) {
  if (value === null || value === undefined) return '—';
  return Number(value).toLocaleString('vi-VN') + ' đ';
}

function formatDateTime(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function TheoDoiNoSection() {
  const [dsNo, setDsNo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [searchKy, setSearchKy] = useState('');
  const [searchHD, setSearchHD] = useState('');
  const [mucQuaHan, setMucQuaHan] = useState(0);

  const [selectedHD, setSelectedHD] = useState(null);

  // ===== PHÂN TRANG =====
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchKy, searchHD, mucQuaHan]);

  // ===== HÀM GỌI CHI TIẾT HÓA ĐƠN (MỚI TÍCH HỢP) =====
  const handleViewChiTiet = async (hd) => {
    try {
      // Gọi API lấy chi tiết bậc thang từ Backend
      const res = await fetch(`${API_URL}/hoadon/${hd.mahd}`);
      if (res.ok) {
        const detailData = await res.json();
        // Gộp dữ liệu hiển thị ở bảng với mảng chiTiet lấy từ API
        setSelectedHD({ ...hd, ...detailData });
      } else {
        setMessage({ type: 'error', text: `Không thể tải chi tiết cho hóa đơn ${hd.mahd}` });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Lỗi kết nối khi tải chi tiết hóa đơn' });
    }
  };

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

  const tinhSoNgayNo = (ngayLap) => {
    if (!ngayLap) return 0;
    const diffTime = new Date() - new Date(ngayLap);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) || 0;
  };

  // ===== FILTER =====
  const dsNoHienThi = dsNo.filter((hd) => {
    const matchKy = !searchKy || (hd.ky && hd.ky.toString().toLowerCase().includes(searchKy.toLowerCase()));
    const matchTen = !searchHD || (hd.mahd && hd.mahd.toLowerCase().includes(searchHD.toLowerCase()));
    const matchOverdue = mucQuaHan === 0 || tinhSoNgayNo(hd.ngaylaphd) >= mucQuaHan;
    return matchKy && matchTen && matchOverdue;
  });

  // ===== PHÂN TRANG LOGIC =====
  const totalPages = Math.ceil(dsNoHienThi.length / itemsPerPage);
  const dsNoPhanTrang = dsNoHienThi.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNhacNo = (hd) => {
    const noiDung = `Dien luc thong bao: Khach hang ${hd.tenkh} co hoa don ky ${hd.ky} chua thanh toan. So tien: ${formatCurrency(hd.tongthanhtien)}.`;
    window.open(`sms:${hd.dt}?body=${encodeURIComponent(noiDung)}`, '_self');
  };

  return (
    <div className="card">
      <div className="tim-no">
        <div>
          <h2>Tìm hóa đơn nợ:</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px' }}>
            <div>
              <label>Kỳ hóa đơn:</label>
              <input style={{ borderRadius: '4px', border: '1px solid #ccc', padding: '4px 8px', height: '32px', width: '200px' }} type="text" placeholder="VD: 10/2023" value={searchKy} onChange={(e) => setSearchKy(e.target.value)} />
            </div>
            <div>
              <label>Mã hóa đơn:</label>
              <input style={{ borderRadius: '4px', border: '1px solid #ccc', padding: '4px 8px', height: '32px', width: '200px' }} type="text" placeholder="VD: HD000001" value={searchHD} onChange={(e) => setSearchHD(e.target.value)} />
            </div>
            <div>
              <label style={{ fontWeight: 'bold' }}>Lọc theo thời gian nợ:</label>
              <select style={{ width: '220px', height: '32px', borderRadius: '4px', border: '1px solid #ccc', padding: '6px 10px' }} value={mucQuaHan} onChange={(e) => setMucQuaHan(Number(e.target.value))}>
                <option value={0}>Tất cả nợ</option>
                <option value={10}>Nợ trên 10 ngày</option>
                <option value={20}>Nợ trên 20 ngày</option>
                <option value={30}>Nợ trên 1 tháng (30 ngày)</option>
              </select>
            </div>
          </div>
        </div>
        <div style={{ paddingTop: '20px', textAlign: 'right' }}>
          <button className="btn btn-primary" onClick={fetchDanhSachNo} style={{ marginLeft: '8px' }}>Làm mới danh sách</button>
        </div>
      </div>

      {message && <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>{message.text}</div>}

      {loading ? (
        <div className="state-loading">Đang tải danh sách nợ...</div>
      ) : dsNoHienThi.length === 0 ? (
        <div className="state-empty" style={{ backgroundColor: 'var(--bg-success)', color: 'var(--text-success)' }}>Không tìm thấy hóa đơn nợ nào.</div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="price-table">
              <thead>
                <tr>
                  <th>Mã HĐ</th>
                  <th>Khách hàng</th>
                  <th>Kỳ</th>
                  <th>T.Gian Chốt</th>
                  <th>Chỉ số (Đầu - Cuối)</th>
                  <th>Tổng Tiền</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {dsNoPhanTrang.map((hd) => (
                  <tr key={hd.mahd} style={{ backgroundColor: 'var(--bg-error)', cursor: 'pointer' }} onClick={() => handleViewChiTiet(hd)}>
                    <td className="cell-center"><strong>{hd.mahd}</strong></td>
                    <td>{hd.tenkh}</td>
                    <td className="cell-center">{hd.ky}</td>
                    <td className="cell-date">{formatDateTime(hd.ngaylaphd)}</td>
                    <td className="cell-center">{hd.chisodau} - {hd.chisocuoi}</td>
                    <td className="cell-price"><span className="price-value" style={{ color: 'var(--danger-color)' }}>{formatCurrency(hd.tongthanhtien)}</span></td>
                    <td className="cell-center">
                      <button onClick={(e) => { e.stopPropagation(); handleThanhToan(hd.mahd); }} style={{ borderRadius: '4px', marginRight: '8px', backgroundColor: '#128835', color: '#fff', border: 'none', padding: '6px 12px', cursor: 'pointer' }}>Đã Thu</button>
                      <button style={{ borderRadius: '4px', backgroundColor: '#be1717', color: '#fff', border: 'none', padding: '6px 12px', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handleNhacNo(hd); }}>Nhắc Nợ</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', padding: '14px 18px', background: '#f5f5f5', borderRadius: '8px' }}>
            <div style={{ color: '#555', fontSize: '15px' }}>Hiển thị trang <strong>{currentPage}</strong> / <strong>{totalPages}</strong> ({dsNoHienThi.length} hóa đơn)</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} style={{ width: '36px', height: '36px', border: '1px solid #dcdcdc', borderRadius: '6px', backgroundColor: currentPage === 1 ? '#f0f0f0' : '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: '18px', color: '#666' }}>‹</button>
              <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} style={{ width: '36px', height: '36px', border: '1px solid #dcdcdc', borderRadius: '6px', backgroundColor: currentPage === totalPages ? '#f0f0f0' : '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: '18px', color: '#666' }}>›</button>
            </div>
          </div>
        </>
      )}

      {selectedHD && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="modal-content" style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', width: '650px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}>
            <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '20px', borderBottom: '2px solid #3498db', paddingBottom: '10px' }}>CHI TIẾT HÓA ĐƠN TIỀN ĐIỆN</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              <div>
                <p><strong>Khách hàng:</strong> {selectedHD.tenkh}</p>
                <p><strong>SĐT:</strong> {selectedHD.dt}</p>
                <p><strong>Địa chỉ:</strong> {selectedHD.diachi}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p><strong>Mã HĐ:</strong> <span style={{ color: '#e67e22' }}>{selectedHD.mahd}</span></p>
                <p><strong>Kỳ:</strong> {selectedHD.ky}</p>
                <p><strong>Mã điện kế:</strong> {selectedHD.madk || 'DK-001'}</p>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Chỉ số đầu</th>
                  <th style={{ padding: '10px', textAlign: 'center' }}>Chỉ số cuối</th>
                  <th style={{ textAlign: 'right', padding: '10px' }}>Sản lượng (kWh)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '10px' }}>{selectedHD.chisodau}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{selectedHD.chisocuoi}</td>
                  <td style={{ textAlign: 'right', padding: '10px', fontWeight: 'bold', color: '#2563eb' }}>{selectedHD.chisocuoi - selectedHD.chisodau}</td>
                </tr>
              </tbody>
            </table>

            <div className="bill-table-panel" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
              <div className="bill-table-header" style={{ backgroundColor: '#f1f5f9', padding: '12px 15px', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0' }}>📊 Phân tích tiền điện theo bậc thang</div>
              <table className="bill-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '10px 15px', textAlign: 'left' }}>Bậc</th>
                    <th style={{ padding: '10px 15px', textAlign: 'center' }}>Số lượng</th>
                    <th style={{ padding: '10px 15px', textAlign: 'right' }}>Đơn giá</th>
                    <th style={{ padding: '10px 15px', textAlign: 'right' }}>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedHD.chiTiet && selectedHD.chiTiet.length > 0 ? (
                    selectedHD.chiTiet.map((ct, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px 15px' }}>Bậc {ct.id?.mabac || ct.mabac}</td>
                        <td style={{ padding: '10px 15px', textAlign: 'center' }}>{ct.dntt}</td>
                        <td style={{ padding: '10px 15px', textAlign: 'right' }}>{formatCurrency(ct.dongia)}</td>
                        <td style={{ padding: '10px 15px', textAlign: 'right', color: '#16a34a', fontWeight: '500' }}>{formatCurrency(ct.dntt * ct.dongia)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4" style={{ padding: '25px', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center' }}>Hóa đơn này không có chi tiết bậc thang.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ borderTop: '2px solid #eee', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', color: '#64748b' }}>Tổng thanh toán (chưa VAT):</span>
              <h3 style={{ margin: 0 }}><span style={{ color: '#dc2626', fontSize: '1.6rem', fontWeight: 'bold' }}>{formatCurrency(selectedHD.tongthanhtien)}</span></h3>
            </div>

            <div style={{ marginTop: '30px', textAlign: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedHD(null)} style={{ padding: '10px 35px', borderRadius: '25px', cursor: 'pointer', backgroundColor: '#64748b', color: 'white', border: 'none' }}>Đóng cửa sổ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}