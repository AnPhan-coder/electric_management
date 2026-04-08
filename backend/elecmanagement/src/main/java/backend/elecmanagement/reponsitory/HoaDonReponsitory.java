package backend.elecmanagement.reponsitory;

import backend.elecmanagement.dto.request.KhachHangNoDTO;
import backend.elecmanagement.entity.HoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface HoaDonReponsitory extends JpaRepository<HoaDon, String> {

    @Query("SELECT h FROM HoaDon h WHERE h.mahd IN (SELECT c.id.mahd FROM CtHoaDon c WHERE c.id.madk = :madk) ORDER BY h.denngay DESC")
    List<HoaDon> findHistoryByMadk(@Param("madk") String madk);

    @Query("SELECT DISTINCT new backend.elecmanagement.dto.request.KhachHangNoDTO(" +
            "h.mahd, k.makh, k.tenkh, k.diachi, k.dt, h.tongthanhtien, h.ky, h.tinhtrang) " +
            "FROM HoaDon h " +
            "JOIN CtHoaDon c ON h.mahd = c.id.mahd " +
            "JOIN DienKe d ON c.id.madk = d.madk " +
            "JOIN KhachHang k ON d.makh = k.makh " +
            "WHERE h.tinhtrang = false")
    List<KhachHangNoDTO> findDanhSachNo();

    @Query("SELECT COUNT(h) FROM HoaDon h WHERE h.tinhtrang = false")
    long countKhachHangNo();
}
