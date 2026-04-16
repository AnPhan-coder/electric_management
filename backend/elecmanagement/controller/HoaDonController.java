package backend.elecmanagement.controller;

import backend.elecmanagement.dto.request.TinhTienRequest;
import backend.elecmanagement.entity.HoaDon;
import backend.elecmanagement.service.HoaDonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}