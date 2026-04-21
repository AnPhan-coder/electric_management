package backend.elecmanagement.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent; 
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TinhTienRequest {

    @NotBlank(message = "Mã điện kế không được để trống")
    private String madk;

    @NotNull(message = "Chỉ số cuối không được để trống")
    @Min(value = 0, message = "Chỉ số cuối phải >= 0")
    private Integer chisocuoi;

    @NotNull(message = "Ngày chốt số không được để trống")
    @PastOrPresent(message = "Ngày chốt số không được vượt quá ngày hiện tại")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime denngay;
}