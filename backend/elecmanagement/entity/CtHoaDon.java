package backend.elecmanagement.entity;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CtHoaDon {
    @EmbeddedId
    private CtHoaDonId id;
    private Integer dntt;
    private BigDecimal dongia;
}
