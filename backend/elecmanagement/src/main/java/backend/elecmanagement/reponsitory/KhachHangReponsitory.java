package backend.elecmanagement.reponsitory;
import backend.elecmanagement.entity.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface KhachHangReponsitory extends JpaRepository<KhachHang, String> {
    
    @Query("SELECT k FROM KhachHang k WHERE k.trangthai = true OR k.trangthai IS NULL")
    List<KhachHang> findAllActive();
}
