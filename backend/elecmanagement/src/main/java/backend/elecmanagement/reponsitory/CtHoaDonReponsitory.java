package backend.elecmanagement.reponsitory;

import backend.elecmanagement.entity.CtHoaDon;
import backend.elecmanagement.entity.CtHoaDonId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CtHoaDonReponsitory extends JpaRepository<CtHoaDon, CtHoaDonId> {
    List<CtHoaDon> findByIdMahd(String mahd);
}
