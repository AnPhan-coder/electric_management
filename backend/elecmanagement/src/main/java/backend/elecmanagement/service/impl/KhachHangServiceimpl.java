package backend.elecmanagement.service.impl;

import backend.elecmanagement.entity.DienKe;
import backend.elecmanagement.entity.HoaDon;
import backend.elecmanagement.entity.KhachHang;
import backend.elecmanagement.reponsitory.DienKeReponsitory;
import backend.elecmanagement.reponsitory.HoaDonReponsitory;
import backend.elecmanagement.reponsitory.KhachHangReponsitory;
import backend.elecmanagement.service.KhachHangService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KhachHangServiceimpl implements KhachHangService {

    private final KhachHangReponsitory khachHangReponsitory;
    private final DienKeReponsitory dienKeReponsitory;
    private final HoaDonReponsitory hoaDonReponsitory;

    public KhachHangServiceimpl(KhachHangReponsitory khachHangReponsitory, 
                                DienKeReponsitory dienKeReponsitory, 
                                HoaDonReponsitory hoaDonReponsitory) {
        this.khachHangReponsitory = khachHangReponsitory;
        this.dienKeReponsitory = dienKeReponsitory;
        this.hoaDonReponsitory = hoaDonReponsitory;
    }

    @Override
    public List<KhachHang> findAllActive() {
        return khachHangReponsitory.findAllActive();
    }

    @Override
    public KhachHang create(KhachHang khachHang) {
        if(khachHangReponsitory.existsById(khachHang.getMakh())) {
            throw new RuntimeException("Mã khách hàng đã tồn tại");
        }
        if(khachHang.getTrangthai() == null) {
            khachHang.setTrangthai(true);
        }
        return khachHangReponsitory.save(khachHang);
    }

    @Override
    public KhachHang update(String makh, KhachHang details) {
        KhachHang kh = khachHangReponsitory.findById(makh)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Khách Hàng: " + makh));
        kh.setTenkh(details.getTenkh());
        kh.setDiachi(details.getDiachi());
        kh.setDt(details.getDt());
        kh.setCmnd(details.getCmnd());
        return khachHangReponsitory.save(kh);
    }

    @Override
    public void delete(String makh) {
        KhachHang kh = khachHangReponsitory.findById(makh)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Khách Hàng: " + makh));

        // Kiểm tra xem khách hàng có điện kế không
        boolean hasDienKe = dienKeReponsitory.findAll().stream().anyMatch(dk -> dk.getMakh() != null && dk.getMakh().equals(makh));
        
        if (hasDienKe) {
            // Kiểm tra xem có hóa đơn không (thông qua điện kế)
            // Lấy tất cả điện kế của khách hàng này
            List<DienKe> dienKes = dienKeReponsitory.findAll().stream().filter(dk -> dk.getMakh() != null && dk.getMakh().equals(makh)).toList();
            boolean hasHoaDon = false;
            for(DienKe dk : dienKes) {
                // Sửa logic tuỳ thuộc vào việc get danh sách hóa đơn theo madk có rỗng không
                List<HoaDon> _hds = hoaDonReponsitory.findHistoryByMadk(dk.getMadk());
                if (_hds != null && !_hds.isEmpty()) {
                    hasHoaDon = true;
                    break;
                }
            }

            if (hasHoaDon) {
                // Ẩn (Soft-delete) nếu đã có hóa đơn
                kh.setTrangthai(false);
                khachHangReponsitory.save(kh);
            } else {
                // Có điện kế nhưng chưa có hóa đơn. Tuỳ yêu cầu có thể là xóa cứng hoặc cũng ẩn đi. Ở đây ta ẩn cho an toàn vì có liên kết với bảng DIENKE
                kh.setTrangthai(false);
                khachHangReponsitory.save(kh);
            }
        } else {
            // Không có liên kết, xóa cứng
            khachHangReponsitory.delete(kh);
        }
    }
}
