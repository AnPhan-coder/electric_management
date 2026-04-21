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
        // Kiểm tra mã điện kế đủ 8 số (Theo tài liệu word)
        if (dienKe.getMadk() == null || !dienKe.getMadk().matches("^[0-9]{8}$")) {
            throw new RuntimeException("Mã điện kế phải là 8 chữ số");
        }

        // Kiểm tra logic ngày
        LocalDateTime now = LocalDateTime.now();
        if (dienKe.getNgaysx().isAfter(now) || dienKe.getNgaylap().isAfter(now) || dienKe.getNgaysx().isAfter(dienKe.getNgaylap())) {
            throw new RuntimeException("Logic ngày không hợp lệ");
        }

        // Kiểm tra khách hàng tồn tại
        if (!khachHangReponsitory.existsById(dienKe.getMakh())) {
            throw new RuntimeException("Không tìm thấy khách hàng");
        }

        // Kiểm tra trùng mã ĐK (Nếu là thêm mới)
        if (dienKeReponsitory.existsById(dienKe.getMadk())) {
            throw new RuntimeException("Trùng mã điện kế");
        }

        return dienKeReponsitory.save(dienKe);
    }

    public void delete(String id) {
        dienKeReponsitory.deleteById(id);
    }
}
