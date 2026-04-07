package backend.elecmanagement.dto.request;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TinhTienRequest {
    private String madk;
    private Integer chisocuoi;
    private LocalDateTime denngay;
}