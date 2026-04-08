package backend.elecmanagement.controller;

import backend.elecmanagement.dto.request.KhachHangNoDTO;
import backend.elecmanagement.dto.request.TinhTienRequest;
import backend.elecmanagement.entity.HoaDon;
import backend.elecmanagement.reponsitory.HoaDonReponsitory;
import backend.elecmanagement.service.HoaDonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "hoadon")
@CrossOrigin("*")
public class HoaDonController {
    private final HoaDonService hoaDonService;


    public HoaDonController(HoaDonService hoaDonService) {
        this.hoaDonService = hoaDonService;
    }

    @PostMapping(value = "tinhtien")
    public ResponseEntity<?> tinhTienDien(@RequestBody TinhTienRequest request){
        try {
            // Thực hiện tính tiền dựa vào dữ liệu request
            HoaDon hoaDon = hoaDonService.tinhTienDien(
                    request.getMadk(),
                    request.getChisocuoi(),
                    request.getDenngay()
            );
            return ResponseEntity.ok(hoaDon);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/danh-sach-no")
    public ResponseEntity<List<KhachHangNoDTO>> getDanhSachNo() {
        // Gọi hàm từ Service thay vì Repository
        List<KhachHangNoDTO> danhSachNo = hoaDonService.getDanhSachNo();
        return ResponseEntity.ok(danhSachNo);
    }
    @GetMapping("/dem-no")
    public ResponseEntity<Long> countNo() {
        return ResponseEntity.ok(hoaDonService.demSoLuongKhachNo());
    }
}