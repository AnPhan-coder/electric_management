package backend.elecmanagement.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KhachHangNoDTO {
    private String maHd;
    private String maKh;
    private String tenKh;
    private String diaChi;
    private String dienThoai;
    private BigDecimal tongTien;
    private String ky;
    private boolean tinhtrang;
}
