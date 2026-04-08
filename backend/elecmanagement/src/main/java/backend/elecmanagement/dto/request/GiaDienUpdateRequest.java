package backend.elecmanagement.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class GiaDienUpdateRequest {
    private Integer mabac;
    private BigDecimal dongia;
}
