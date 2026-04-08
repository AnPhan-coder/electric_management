package backend.elecmanagement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "LICHSU_GIADIEN")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LichSuGiaDien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "malichsu")
    private Integer malichsu;

    @Column(name = "mabac")
    private Integer mabac;

    @Column(name = "tenbac", columnDefinition = "nvarchar(50)")
    private String tenbac;

    @Column(name = "tusokw")
    private Integer tusokw;

    @Column(name = "densokw")
    private Integer densokw;

    @Column(name = "dongia")
    private BigDecimal dongia;

    @Column(name = "ngayapdung")
    private LocalDateTime ngayapdung;

    @Column(name = "ngaythaydoi")
    private LocalDateTime ngaythaydoi;
}
