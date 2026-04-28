package backend.elecmanagement.controller;

import backend.elecmanagement.dto.request.CTHOADONNO;
import backend.elecmanagement.dto.request.TinhTienRequest;
import backend.elecmanagement.entity.HoaDon;
import backend.elecmanagement.service.HoaDonService;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "hoadon")
@CrossOrigin("*")
public class HoaDonController {
    private final HoaDonService hoaDonService;
    @Autowired
    private backend.elecmanagement.reponsitory.HoaDonReponsitory hoaDonReponsitory;
    @Autowired
    private backend.elecmanagement.reponsitory.DienKeReponsitory dienKeReponsitory;

    public HoaDonController(HoaDonService hoaDonService) {
        this.hoaDonService = hoaDonService;
    }

    @PostMapping(value = "tinhtien")
    public ResponseEntity<?> tinhTienDien(@Valid @RequestBody TinhTienRequest request) {
        HoaDon hoaDon = hoaDonService.tinhTienDien(
                request.getMadk(),
                request.getChisocuoi(),
                request.getDenngay());
        return ResponseEntity.ok(hoaDon);
    }

    @GetMapping("/no")
    public ResponseEntity<java.util.List<CTHOADONNO>> getDanhSachNo() {
        return ResponseEntity.ok(hoaDonService.getDanhSachNo());
    }

    @PutMapping("/{mahd}/thanhtoan")
    public ResponseEntity<Void> thanhToanHoaDon(@PathVariable String mahd) {
        hoaDonService.thanhToanHoaDon(mahd);
        return ResponseEntity.ok().build();
    }

    @GetMapping("chisodau/{madk}")
    public ResponseEntity<Integer> getChiSoDau(@PathVariable String madk) {
        try {
            java.util.List<HoaDon> previousBills = hoaDonReponsitory.findHistoryByMadk(madk);
            int chisodau = previousBills.isEmpty() ? 0 : previousBills.get(0).getChisocuoi();
            return ResponseEntity.ok(chisodau);
        } catch (Exception e) {
            return ResponseEntity.ok(0);
        }
    }
    @GetMapping ("/{mahd}")
    public ResponseEntity<CTHOADONNO> xemChiTiet(@PathVariable String mahd) {
        CTHOADONNO dto = hoaDonService.findChiTietByMaHD(mahd);
        if (dto != null) {
            return ResponseEntity.ok(dto);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("thongtin-ky-truoc/{madk}")
    public ResponseEntity<java.util.Map<String, Object>> getThongTinKyTruoc(@PathVariable String madk) {
        java.util.Map<String, Object> result = new java.util.HashMap<>();
        try {
            java.util.List<backend.elecmanagement.entity.HoaDon> previousBills = hoaDonReponsitory.findHistoryByMadk(madk);
            if (previousBills.isEmpty()) {
                // Nếu chưa có hóa đơn nào -> Lấy Ngày lắp đặt điện kế làm mốc
                backend.elecmanagement.entity.DienKe dk = dienKeReponsitory.findById(madk).orElseThrow();
                result.put("chisodau", 0);
                result.put("ngaychotcuoi", dk.getNgaylap()); 
            } else {
                // Nếu đã có hóa đơn -> Lấy Chỉ số cuối & Ngày chốt của kỳ trước làm mốc
                result.put("chisodau", previousBills.get(0).getChisocuoi());
                result.put("ngaychotcuoi", previousBills.get(0).getDenngay());
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
