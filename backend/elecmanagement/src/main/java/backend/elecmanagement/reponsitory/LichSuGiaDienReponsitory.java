package backend.elecmanagement.reponsitory;

import backend.elecmanagement.entity.LichSuGiaDien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LichSuGiaDienReponsitory extends JpaRepository<LichSuGiaDien, Integer> {

    /**
     * Lấy danh sách các phiên lịch sử (nhóm theo ngaythaydoi, lấy bản ghi đại diện đầu tiên).
     * Dùng MIN(malichsu) để lấy một đại diện cho mỗi mốc thời gian thay đổi.
     */
    @Query("SELECT l FROM LichSuGiaDien l WHERE l.malichsu IN " +
           "(SELECT MIN(l2.malichsu) FROM LichSuGiaDien l2 GROUP BY l2.ngaythaydoi) " +
           "ORDER BY l.ngaythaydoi DESC")
    List<LichSuGiaDien> findDistinctPhienBang();

    /**
     * Lấy toàn bộ chi tiết lịch sử trong cùng một mốc thời gian thay đổi (một phiên).
     */
    @Query("SELECT l FROM LichSuGiaDien l WHERE l.ngaythaydoi = " +
           "(SELECT l2.ngaythaydoi FROM LichSuGiaDien l2 WHERE l2.malichsu = :malichsuDaiDien) " +
           "ORDER BY l.mabac ASC")
    List<LichSuGiaDien> findChiTietByMalichsuDaiDien(Integer malichsuDaiDien);
}
