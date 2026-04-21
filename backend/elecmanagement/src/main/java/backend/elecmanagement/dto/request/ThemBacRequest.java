package backend.elecmanagement.dto.request;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ThemBacRequest {
    private Integer densokwBacHienTai;
    private BigDecimal dongiaBacMoi;
}
