package backend.elecmanagement.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HoaDon {
    @Id
    @Column(columnDefinition = "varchar(10)", nullable = false)
    private String mahd;
    @Column(columnDefinition = "varchar(7)")
    private String ky;
    private LocalDateTime tungay;
    private LocalDateTime denngay;
    private Integer chisodau;
    private Integer chisocuoi;
    private BigDecimal tongthanhtien;
    private LocalDateTime ngaylaphd;
    private Boolean tinhtrang;
    @Transient
    private List<CtHoaDon> chiTiet;
}
