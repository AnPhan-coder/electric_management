package backend.elecmanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CreateDienKeRequest {

    @NotBlank(message = "Mã điện kế không được để trống")
    @Pattern(regexp = "^\\d{8}$", message = "Mã điện kế phải gồm đúng 8 chữ số [cite: 108]")
    private String madk;

    @NotBlank(message = "Mã khách hàng không được để trống")
    private String makh;

    @NotNull(message = "Ngày sản xuất không được để trống")
    @PastOrPresent(message = "Ngày sản xuất phải <= ngày hiện tại [cite: 108]")
    private LocalDateTime ngaysx;

    @NotNull(message = "Ngày lắp đặt không được để trống")
    @PastOrPresent(message = "Ngày lắp đặt phải <= ngày hiện tại [cite: 108]")
    private LocalDateTime ngaylap;

    @NotBlank(message = "Mô tả không được để trống [cite: 108]")
    private String mota;

    private Boolean trangthai;

    @NotBlank(message = "Địa chỉ điện kế không được để trống")
    private String diachi;
}