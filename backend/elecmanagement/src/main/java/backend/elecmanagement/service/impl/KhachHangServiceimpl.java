package backend.elecmanagement.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import backend.elecmanagement.entity.DienKe;
import backend.elecmanagement.entity.HoaDon;
import backend.elecmanagement.entity.KhachHang;
import backend.elecmanagement.reponsitory.DienKeReponsitory;
import backend.elecmanagement.reponsitory.HoaDonReponsitory;
import backend.elecmanagement.reponsitory.KhachHangReponsitory;
import backend.elecmanagement.service.KhachHangService;

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

    // Hàm dùng chung để kiểm tra ràng buộc dữ liệu
    private void validateKhachHang(KhachHang kh) {
        // 1. Kiểm tra số điện thoại (Phải đúng 10 số)
        if (kh.getDt() == null || kh.getDt().trim().isEmpty()) {
             throw new RuntimeException("Số điện thoại không được để trống");
        }
        
        // Loại bỏ khoảng trắng nếu có
        String sdt = kh.getDt().trim();
        
        if (sdt.length() != 10) {
            throw new RuntimeException("Số điện thoại phải có đúng 10 chữ số (Hiện tại: " + sdt.length() + ")");
        }
        
        if (!sdt.matches("\\d+")) {
            throw new RuntimeException("Số điện thoại chỉ được chứa các chữ số");
        }

        // 2. Kiểm tra CMND (Ví dụ tối thiểu 9, tối đa 12)
        if (kh.getCmnd() != null && !kh.getCmnd().trim().isEmpty()) {
            String cmnd = kh.getCmnd().trim();
            if (!cmnd.matches("\\d+")) {
                throw new RuntimeException("CMND/CCCD chỉ được chứa các chữ số");
            }
        }
    }

    @Override
    public List<KhachHang> findAllActive() {
        return khachHangReponsitory.findAllActive();
    }

    @Override
    public KhachHang create(KhachHang khachHang) {
        // Kiểm tra trùng mã
        if(khachHangReponsitory.existsById(khachHang.getMakh())) {
            throw new RuntimeException("Mã khách hàng " + khachHang.getMakh() + " đã tồn tại");
        }

        // Kiểm tra các ràng buộc SĐT, CMND
        validateKhachHang(khachHang);

        if(khachHang.getTrangthai() == null) {
            khachHang.setTrangthai(true);
        }
        
        return khachHangReponsitory.save(khachHang);
    }

    @Override
    public KhachHang update(String makh, KhachHang details) {
        KhachHang kh = khachHangReponsitory.findById(makh)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Khách Hàng: " + makh));
        
        // Kiểm tra ràng buộc cho dữ liệu mới trước khi cập nhật
        validateKhachHang(details);

        kh.setTenkh(details.getTenkh());
        kh.setDiachi(details.getDiachi());
        kh.setDt(details.getDt().trim());
        kh.setCmnd(details.getCmnd() != null ? details.getCmnd().trim() : null);
        
        return khachHangReponsitory.save(kh);
    }

    @Override
    public void delete(String makh) {
        KhachHang kh = khachHangReponsitory.findById(makh)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Khách Hàng: " + makh));

        // Kiểm tra xem khách hàng có điện kế không
        boolean hasDienKe = dienKeReponsitory.findAll().stream()
                .anyMatch(dk -> dk.getMakh() != null && dk.getMakh().equals(makh));
        
        if (hasDienKe) {
            // Lấy tất cả điện kế của khách hàng này để kiểm tra hóa đơn
            List<DienKe> dienKes = dienKeReponsitory.findAll().stream()
                    .filter(dk -> dk.getMakh() != null && dk.getMakh().equals(makh))
                    .toList();
            
            boolean hasHoaDon = false;
            for(DienKe dk : dienKes) {
                List<HoaDon> _hds = hoaDonReponsitory.findHistoryByMadk(dk.getMadk());
                if (_hds != null && !_hds.isEmpty()) {
                    hasHoaDon = true;
                    break;
                }
            }

            // Dù có hóa đơn hay chỉ mới có điện kế, ta đều ẩn (Soft-delete) để giữ toàn vẹn dữ liệu
            kh.setTrangthai(false);
            khachHangReponsitory.save(kh);
        } else {
            // Không có bất kỳ liên kết nào, xóa cứng khỏi DB
            khachHangReponsitory.delete(kh);
        }
    }
}