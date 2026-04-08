package backend.elecmanagement.controller;


import backend.elecmanagement.entity.KhachHang;
import backend.elecmanagement.service.KhachHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/khach-hang")
@CrossOrigin("*")
public class KhachHangController {

    @Autowired
    private KhachHangService khachHangService;

    @GetMapping
    public List<KhachHang> getAll() {
        return khachHangService.getAllKhachHang();
    }

    // Sửa lại thành getKhachHangChiTiet để lấy cả mã Điện kế
    @GetMapping("/{maKh}")
    public ResponseEntity<?> getById(@PathVariable String maKh) {
        Map<String, Object> chiTiet = khachHangService.getKhachHangChiTiet(maKh);
        if (chiTiet != null) {
            return ResponseEntity.ok(chiTiet);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy khách hàng");
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody KhachHang khachHang) {
        try {
            KhachHang newKh = khachHangService.createKhachHang(khachHang);
            return ResponseEntity.ok(newKh);
        } catch (Exception e) {
            // Trả về lỗi 400 kèm câu thông báo "Trùng mã khách hàng!"
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{maKh}")
    public ResponseEntity<?> update(@PathVariable String maKh, @RequestBody KhachHang khachHang) {
        KhachHang updatedKh = khachHangService.updateKhachHang(maKh, khachHang);
        if (updatedKh != null) {
            return ResponseEntity.ok(updatedKh);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy khách hàng để sửa");
    }

    // Đổi từ HTTP DELETE (Xóa vật lý) sang HTTP PATCH hoặc PUT (Cập nhật trạng thái)
    @PatchMapping("/{maKh}/ngung-dich-vu")
    public ResponseEntity<?> ngungDichVu(@PathVariable String maKh) {
        try {
            khachHangService.ngungDichVuKhachHang(maKh);
            return ResponseEntity.ok("Ngừng dịch vụ thành công!");
        } catch (Exception e) {
            // Trả về lỗi 400 kèm câu thông báo "Phải thanh toán hết nợ..."
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
