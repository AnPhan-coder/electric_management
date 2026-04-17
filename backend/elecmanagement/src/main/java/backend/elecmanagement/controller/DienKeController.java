package backend.elecmanagement.controller;

import backend.elecmanagement.dto.request.CreateDienKeRequest;
import backend.elecmanagement.entity.DienKe;
import backend.elecmanagement.service.DienKeService;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "dienke")
@CrossOrigin("*")
public class DienKeController {
    private final DienKeService dienKeService;

    public DienKeController(DienKeService dienKeService) {
        this.dienKeService = dienKeService;
    }

    @GetMapping
    public ResponseEntity<List<DienKe>> getAllDienKe() {
        return ResponseEntity.ok(dienKeService.findAll());
    }

    @GetMapping(value = "{id}")
    public ResponseEntity<DienKe> getDienKeById(@PathVariable String id) {
        Optional<DienKe> dienKe = dienKeService.findById(id);
        return dienKe.map(o -> ResponseEntity.ok(o)).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createDienKe(@Valid @RequestBody CreateDienKeRequest request) {
        DienKe item = new DienKe();
        item.setMadk(request.getMadk());
        item.setMakh(request.getMakh());
        item.setNgaysx(request.getNgaysx());
        item.setNgaylap(request.getNgaylap());
        item.setMota(request.getMota());
        item.setDiachi(request.getDiachi());
        item.setTrangthai(request.getTrangthai() != null ? request.getTrangthai() : true);

        return ResponseEntity.ok(dienKeService.save(item));
    }
}
