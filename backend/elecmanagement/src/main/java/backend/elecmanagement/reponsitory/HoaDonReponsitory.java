package backend.elecmanagement.reponsitory;

import backend.elecmanagement.entity.HoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HoaDonReponsitory extends JpaRepository<HoaDon, String> {

    @Query("SELECT h FROM HoaDon h WHERE h.mahd IN (SELECT c.id.mahd FROM CtHoaDon c WHERE c.id.madk = :madk) ORDER BY h.denngay DESC")
    List<HoaDon> findHistoryByMadk(@Param("madk") String madk);
}
