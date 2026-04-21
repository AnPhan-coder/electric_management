package backend.elecmanagement.service;

import backend.elecmanagement.entity.HoaDon;

import java.time.LocalDateTime;

public interface HoaDonService {
    HoaDon tinhTienDien(String madk, int chisocuoi, LocalDateTime denngay);
}
