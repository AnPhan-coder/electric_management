package backend.elecmanagement.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.elecmanagement.entity.KhachHang;
import backend.elecmanagement.service.KhachHangService;

@RestController
@RequestMapping("/khachhang")
@CrossOrigin("*")
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
