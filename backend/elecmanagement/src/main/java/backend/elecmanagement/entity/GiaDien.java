package backend.elecmanagement.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GiaDien {
    @Id
    private int mabac;
    @Column(columnDefinition = "nvarchar(50)")
    private String tenbac;
    private Integer tusokw;
    private Integer densokw;
    private BigDecimal dongia;
    private LocalDateTime ngayapdung;
}