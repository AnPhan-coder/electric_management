package backend.elecmanagement.controller;

import backend.elecmanagement.entity.KhachHang;
import backend.elecmanagement.service.KhachHangService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/khachhang")
@CrossOrigin(origins = "http://localhost:5173")
public class KhachHangController {

    private final KhachHangService khachHangService;

    public KhachHangController(KhachHangService khachHangService) {
        this.khachHangService = khachHangService;
    }

    @GetMapping
    public ResponseEntity<List<KhachHang>> getDanhSachKhachHang() {
        return ResponseEntity.ok(khachHangService.findAllActive());
    }

    @PostMapping
    public ResponseEntity<KhachHang> addKhachHang(@RequestBody KhachHang khachHang) {
        return ResponseEntity.ok(khachHangService.create(khachHang));
    }

    @PutMapping("/{makh}")
    public ResponseEntity<KhachHang> updateKhachHang(@PathVariable String makh, @RequestBody KhachHang khachHang) {
        return ResponseEntity.ok(khachHangService.update(makh, khachHang));
    }

    @DeleteMapping("/{makh}")
    public ResponseEntity<Void> deleteKhachHang(@PathVariable String makh) {
        khachHangService.delete(makh);
        return ResponseEntity.ok().build();
    }
}
