package backend.elecmanagement.service;



import backend.elecmanagement.entity.KhachHang;

import java.util.List;
import java.util.Map;

public interface KhachHangService {
    List<KhachHang> getAllKhachHang();
    Map<String, Object> getKhachHangChiTiet(String maKh); // Đổi kiểu trả về để chứa cả Điện Kế
    KhachHang createKhachHang(KhachHang khachHang) throws Exception; // Thêm throw Exception
    KhachHang updateKhachHang(String maKh, KhachHang khachHang);
    void ngungDichVuKhachHang(String maKh) throws Exception; // Đổi tên từ delete -> ngungDichVu
}