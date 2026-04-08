package backend.elecmanagement.reponsitory;
import backend.elecmanagement.entity.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KhachHangReponsitory extends JpaRepository<KhachHang, String> {
}
