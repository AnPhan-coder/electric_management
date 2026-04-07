package backend.elecmanagement.reponsitory;
import backend.elecmanagement.entity.GiaDien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface GiaDienReponsitory extends JpaRepository<GiaDien, Integer> {
    @Query("SELECT g FROM GiaDien g ORDER BY g.mabac ASC")
    List<GiaDien> findAllOrderByMabacAsc();
}
