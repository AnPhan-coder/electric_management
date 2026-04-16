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
  const [isquahan, setquahan] = useState(false);


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
    const matchOverdue = !isquahan || soNgayNo > 10;
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
          <h3>Tìm hóa đơn nợ:</h3>
          <div >
            <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', gap: '16px' }}>
              <div>
                <label >Kỳ hóa đơn:</label>
                <input
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
                  type="text"
                  id="mahd"
                  name="mahd"
                  placeholder="VD: HD000001"
                  value={searchHD}
                  onChange={(e) => setSearchHD(e.target.value)}
                />
              </div>
            </form>
          </div>
        </div>
        <div >
          <button
            className={`btn ${isquahan ? 'btn-danger' : 'btn-outline-danger'}`}
            onClick={() => setquahan(!isquahan)}
            style={{
              backgroundColor: isquahan ? '#e74c3c' : 'transparent',
              color: isquahan ? 'white' : '#e74c3c',
              border: '1px solid #e74c3c'
            }}
          >
            {isquahan ? 'Đang xem Quá hạn' : 'Xem nợ quá hạn (>10 ngày)'}
          </button>
          <button className="btn btn-edit" onClick={fetchDanhSachNo}  style={{ marginLeft: '8px' }}>Làm mới danh sách</button>
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
                <th>Tên Khách Hàng</th>
                <th>Địa chỉ</th>
                <th>Số điện thoại</th>
                <th>Kỳ</th>
                <th>T.Gian Chốt</th>
                <th>Chỉ số (Đầu - Cuối)</th>
                <th>Tổng Tiền</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {dsNoHienThi.map(hd => (
                <tr key={hd.mahd} style={{ backgroundColor: 'var(--bg-error)' }}>
                  <td className="cell-center"><strong>{hd.mahd}</strong></td>
                  <td>{hd.tenkh}</td>
                  <td>{hd.diachi}</td>
                  <td className="cell-center">{hd.dt}</td>
                  <td className="cell-center">{hd.ky}</td>
                  <td className="cell-date">{formatDateTime(hd.ngaylaphd)}</td>
                  <td className="cell-center">{hd.chisodau} - {hd.chisocuoi}</td>
                  <td className="cell-price">
                    <span className="price-value" style={{ color: 'var(--danger-color)' }}>
                      {formatCurrency(hd.tongthanhtien)}
                    </span>
                  </td>
                  <td className="cell-center">
                    <button className="btn btn-success" onClick={() => handleThanhToan(hd.mahd)} style={{ marginRight: '8px' }}>
                      Đã Thu
                    </button>
                    <button
                      className="btn"
                      style={{ backgroundColor: '#f39c12', color: 'white' }}
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
    </div>
  );
}