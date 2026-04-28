package backend.elecmanagement.service.impl;

import backend.elecmanagement.entity.DienKe;
import backend.elecmanagement.reponsitory.DienKeReponsitory;
import backend.elecmanagement.reponsitory.KhachHangReponsitory;
import backend.elecmanagement.service.DienKeService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DienKeServiceimpl implements DienKeService {
    private final DienKeReponsitory dienKeReponsitory;
    private final KhachHangReponsitory khachHangReponsitory;

    public DienKeServiceimpl(DienKeReponsitory dienKeReponsitory, KhachHangReponsitory khachHangReponsitory) {
        this.dienKeReponsitory = dienKeReponsitory;
        this.khachHangReponsitory = khachHangReponsitory;
    }

    public List<DienKe> findAll() {
        return dienKeReponsitory.findAll();
    }

    public Optional<DienKe> findById(String id) {
        return dienKeReponsitory.findById(id);
    }

    public DienKe save(DienKe dienKe) {
        // Check ngày sản xuất phải bé hơn ngày lắp đặt
        if (!dienKe.getNgaysx().isBefore(dienKe.getNgaylap())) {
            throw new RuntimeException("Ngày sản xuất phải bé hơn ngày lắp đặt!");
        }

        // Check không được vượt quá ngày hiện tại
        if (dienKe.getNgaysx().isAfter(LocalDateTime.now()) || dienKe.getNgaylap().isAfter(LocalDateTime.now())) {
            throw new RuntimeException("Ngày sản xuất và ngày lắp đặt không được lớn hơn ngày hiện tại!");
        }

        // Check mô tả không được rỗng
        if (dienKe.getMota() == null || dienKe.getMota().trim().isEmpty()) {
            throw new RuntimeException("Mô tả không được để trống!");
        }

        backend.elecmanagement.entity.KhachHang khachHang = khachHangReponsitory.findById(dienKe.getMakh())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng trong hệ thống"));

        if (khachHang.getTrangthai() != null && !khachHang.getTrangthai()) {
            throw new RuntimeException("Khách hàng này đang bị ngưng hoạt động, không được phép thêm điện kế mới!");
        }

        if (dienKeReponsitory.existsById(dienKe.getMadk())) {
            throw new RuntimeException("Mã điện kế này đã tồn tại");
        }

        return dienKeReponsitory.save(dienKe);
    }

    public void delete(String id) {
        dienKeReponsitory.deleteById(id);
    }
}
