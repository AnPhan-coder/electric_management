package backend.elecmanagement.dto.request;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateDienKeRequest {
    private String madk;
    private String makh;
    private LocalDateTime ngaysx;
    private LocalDateTime ngaylap;
    private String mota;
    private Boolean trangthai;
}