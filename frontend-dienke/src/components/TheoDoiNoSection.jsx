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
  const [searchKy, setSearchKy] = useState('');
  const [searchHD, setSearchHD] = useState('');
  const [mucQuaHan, setMucQuaHan] = useState(0);
  const [selectedHD, setSelectedHD] = useState(null);


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
  const tinhSoNgayNo = (ngayLap) => {
    if (!ngayLap) return 0;
    const diffTime = new Date() - new Date(ngayLap);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  const dsNoHienThi = dsNo.filter(hd => {
    const matchKy = !searchKy || (hd.ky && hd.ky.toString().toLowerCase().includes(searchKy.toLowerCase()));
    const matchTen = !searchHD || (hd.mahd && hd.mahd.toLowerCase().includes(searchHD.toLowerCase()));
    const soNgayNo = tinhSoNgayNo(hd.ngaylaphd);
    const matchOverdue = mucQuaHan === 0 || soNgayNo >= mucQuaHan;
    return matchKy && matchTen && matchOverdue;
  });
  const handleNhacNo = (hd) => {
    const sdt = hd.dt;
    const ten = hd.tenkh;
    const ky = hd.ky;
    const soTien = formatCurrency(hd.tongthanhtien);
    const noiDung = `Dien luc thong bao: Khach hang ${ten} co hoa don ky ${ky} chua thanh toan. So tien: ${soTien}.`;

    const smsUrl = `sms:${sdt}?body=${encodeURIComponent(noiDung)}`;
    window.open(smsUrl, '_self');
  };

  


  return (
    <div className="card">
      <div className='tim-no'>
        <div>
          <h2>Tìm hóa đơn nợ:</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px' }} >
            <div>
              <label >Kỳ hóa đơn:</label>
              <input
                style={{ borderRadius: '4px', border: '1px solid #ccc', padding: '4px 8px', height: '32px', width: '200px' }}
                type="text"
                id="ky"
                name="ky"
                placeholder="VD: 10/2023"
                value={searchKy}
                onChange={(e) => setSearchKy(e.target.value)}
              />
            </div>
            <div>
              <label >Mã hóa đơn:</label>
              <input
                style={{ borderRadius: '4px', border: '1px solid #ccc', padding: '4px 8px', height: '32px', width: '200px' }}
                type="text"
                id="mahd"
                name="mahd"
                placeholder="VD: HD000001"
                value={searchHD}
                onChange={(e) => setSearchHD(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontWeight: 'bold' }}>Lọc theo thời gian nợ:</label>
              <select

                style={{
                  width: '220px',
                  height: '32px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  padding: '6px 10px',

                }}
                value={mucQuaHan}
                onChange={(e) => setMucQuaHan(Number(e.target.value))}
              >
                <option value={0}>Tất cả nợ</option>
                <option value={10}>Nợ trên 10 ngày</option>
                <option value={20}>Nợ trên 20 ngày</option>
                <option value={30}>Nợ trên 1 tháng (30 ngày)</option>
              </select>
            </div>

          </div>
        </div>
        <div style={{ paddingTop: '20px', textAlign: 'right' }} >
          <button className="btn btn-primary" onClick={fetchDanhSachNo} style={{ marginLeft: '8px' }}>Làm mới danh sách</button>
        </div>
      </div>



      {message && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="state-loading">Đang tải danh sách nợ...</div>
      ) : dsNoHienThi.length === 0 ? (
        <div className="state-empty" style={{ backgroundColor: 'var(--bg-success)', color: 'var(--text-success)' }}>
          {searchKy && `Không tìm thấy hóa đơn nợ nào cho kỳ "${searchKy}"`}
          {searchHD && ` Không tìm thấy hóa đơn nợ nào cho hóa đơn "${searchHD}".:`}
          {!searchKy && !searchHD && "Không tìm thấy hóa đơn nợ nào."}


        </div>
      ) : (
        <div className="table-wrapper">
          <table className="price-table">
            <thead >
              <tr >
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
              {dsNoHienThi.map(hd => (
                <tr key={hd.mahd} style={{ backgroundColor: 'var(--bg-error)', cursor: 'pointer' }} onClick={() => setSelectedHD(hd)}>
                  <td className="cell-center"><strong>{hd.mahd}</strong></td>
                  <td>{hd.tenkh}</td>
                  <td className="cell-center">{hd.ky}</td>
                  <td className="cell-date">{formatDateTime(hd.ngaylaphd)}</td>
                  <td className="cell-center">{hd.chisodau} - {hd.chisocuoi}</td>
                  <td className="cell-price">
                    <span className="price-value" style={{ color: 'var(--danger-color)' }}>
                      {formatCurrency(hd.tongthanhtien)}
                    </span>
                  </td>
                  <td className="cell-center">
                    <button className="" onClick={() => handleThanhToan(hd.mahd)} style={{ borderRadius: '4px', marginRight: '8px', backgroundColor: '#128835', color: '#fff' }}>
                      Đã Thu
                    </button>
                    <button
                      className=""
                      style={{ borderRadius: '4px', backgroundColor: '#be1717', color: '#fff' }}
                      onClick={() => handleNhacNo(hd)}
                    >
                      Nhắc Nợ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {
    selectedHD && (
      <div className="modal-overlay" style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
      }}>
        <div className="modal-content" style={{
          backgroundColor: '#fff', padding: '30px', borderRadius: '12px',
          width: '600px', boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
        }}>
          <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '20px', borderBottom: '2px solid #3498db', paddingBottom: '10px' }}>
            CHI TIẾT HÓA ĐƠN TIỀN ĐIỆN
          </h2>

          {/* Thông tin khách hàng */}
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

          {/* Bảng thông số kỹ thuật */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Chỉ số đầu</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Chỉ số cuối</th>
                <th style={{  textAlign: 'right' }}>Sản Lượng (kWh)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '10px' }}>{selectedHD.chisodau}</td>
                <td style={{ padding: '10px',textAlign: 'center' }}>{selectedHD.chisocuoi}</td>
                <td style={{  textAlign: 'right' }}>{selectedHD.chisocuoi - selectedHD.chisodau} kWh</td>
              </tr>
            </tbody>
          </table>

          {/* Tổng kết tiền */}
          <div style={{ borderTop: '2px solid #eee', paddingTop: '15px', textAlign: 'right' }}>
            <h3 style={{ margin: 0 }}>
              THÀNH TIỀN: <span style={{ color: '#be1717', fontSize: '1.5rem' }}>{formatCurrency(selectedHD.tongthanhtien)}</span>
            </h3>
          </div>

          <div style={{ marginTop: '25px', textAlign: 'center' }}>
            <button
              className="btn btn-secondary"
              onClick={() => setSelectedHD(null)}
              style={{ padding: '10px 30px', borderRadius: '20px', cursor: 'pointer' }}
            >
              Đóng cửa sổ
            </button>
          </div>
        </div>
      </div>
    )
  }
    </div>
  );
}