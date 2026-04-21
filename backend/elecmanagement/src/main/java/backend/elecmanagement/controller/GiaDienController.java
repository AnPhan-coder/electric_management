package backend.elecmanagement.controller;

import backend.elecmanagement.dto.request.GiaDienUpdateRequest;
import backend.elecmanagement.entity.GiaDien;
import backend.elecmanagement.entity.LichSuGiaDien;
import backend.elecmanagement.service.GiaDienService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "giadien")
@CrossOrigin("*")
public class GiaDienController {

    private final GiaDienService giaDienService;

    public GiaDienController(GiaDienService giaDienService) {
        this.giaDienService = giaDienService;
    }

    @GetMapping
    public ResponseEntity<List<GiaDien>> getBangGiaHienTai() {
        return ResponseEntity.ok(giaDienService.getBangGiaHienTai());
    }

    @PutMapping
    public ResponseEntity<?> updateBangGia(@RequestBody List<GiaDienUpdateRequest> updates) {
        try {
            giaDienService.updateBangGia(updates);
            return ResponseEntity.ok("Cập nhật bảng giá thành công");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/lichsu")
    public ResponseEntity<List<LichSuGiaDien>> getDanhSachPhienLichSu() {
        return ResponseEntity.ok(giaDienService.getDanhSachPhienLichSu());
    }

    @GetMapping("/lichsu/{malichsuDaiDien}")
    public ResponseEntity<List<LichSuGiaDien>> getChiTietPhien(
            @PathVariable Integer malichsuDaiDien) {
        return ResponseEntity.ok(giaDienService.getChiTietPhien(malichsuDaiDien));
    }

    @DeleteMapping("/{mabac}")
    public ResponseEntity<?> deleteBacCaoNhat(@PathVariable Integer mabac) {
        try {
            giaDienService.deleteBacCaoNhat(mabac);
            return ResponseEntity.ok().body("Xóa bậc cao nhất thành công");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/them-bac")
    public ResponseEntity<?> themBacCaoNhat(@RequestBody backend.elecmanagement.dto.request.ThemBacRequest request) {
        try {
            giaDienService.themBacCaoNhat(request);
            return ResponseEntity.ok().body("Thêm bậc mức giá mới thành công");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
