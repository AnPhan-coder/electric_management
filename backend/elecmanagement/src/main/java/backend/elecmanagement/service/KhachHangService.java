package backend.elecmanagement.service;

import java.util.List;

import backend.elecmanagement.entity.KhachHang;

public interface KhachHangService {
    List<KhachHang> findAllActive();
    List<KhachHang> findAll();
    KhachHang create(KhachHang khachHang);
    KhachHang update(String makh, KhachHang khachHangDetails);
    void delete(String makh);
}
