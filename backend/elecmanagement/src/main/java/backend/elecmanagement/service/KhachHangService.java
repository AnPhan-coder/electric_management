package backend.elecmanagement.service;

import backend.elecmanagement.entity.KhachHang;

import java.util.List;

public interface KhachHangService {
    List<KhachHang> findAllActive();
    KhachHang create(KhachHang khachHang);
    KhachHang update(String makh, KhachHang khachHangDetails);
    void delete(String makh);
}
