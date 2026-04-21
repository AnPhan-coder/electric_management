package backend.elecmanagement.controller;

import backend.elecmanagement.dto.request.TheodoinoRequest;
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
    public ResponseEntity<java.util.List<TheodoinoRequest>> getDanhSachNo() {
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
}
