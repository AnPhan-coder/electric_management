package backend.elecmanagement.service;

import backend.elecmanagement.dto.request.CTHOADONNO;
import backend.elecmanagement.entity.HoaDon;

import java.time.LocalDateTime;

import java.util.List;

public interface HoaDonService {
    HoaDon tinhTienDien(String madk, int chisocuoi, LocalDateTime denngay);
    List<CTHOADONNO> getDanhSachNo();
    void thanhToanHoaDon(String mahd);
    CTHOADONNO findChiTietByMaHD(String mahd);
}
