package backend.elecmanagement.reponsitory;

import backend.elecmanagement.entity.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KhachHangReponsitory extends JpaRepository<KhachHang, String> {

    // 1. Phục vụ Ràng buộc Xóa: Đếm số hóa đơn chưa thanh toán (tinhtrang = 0) của 1 khách hàng
    @Query(value = "SELECT COUNT(hd.mahd) FROM HOADON hd " +
            "JOIN CTHOADON ct ON hd.mahd = ct.mahd " +
            "JOIN DIENKE dk ON ct.madk = dk.madk " +
            "WHERE dk.makh = :maKh AND hd.tinhtrang = 0", nativeQuery = true)
    int countHoaDonChuaThanhToan(@Param("maKh") String maKh);

    // 2. Phục vụ Tìm kiếm chi tiết: Lấy danh sách Mã Điện Kế của khách hàng này
    @Query(value = "SELECT madk FROM DIENKE WHERE makh = :maKh", nativeQuery = true)
    List<String> findDanhSachDienKeByMaKh(@Param("maKh") String maKh);
}