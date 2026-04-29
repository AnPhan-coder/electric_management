package backend.elecmanagement.dto.request;

import backend.elecmanagement.entity.CtHoaDon;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CTHOADONNO {
    private String mahd;
    private String ky;
    private Integer chisodau;
    private Integer chisocuoi;
    private LocalDateTime ngaylaphd;
    private BigDecimal tongthanhtien;
    private String tenkh;
    private String diachi;
    private String dt;
    private  String madk;
    private List<CtHoaDon> chiTiet;

    public CTHOADONNO(String mahd, String ky, Integer chisodau, Integer chisocuoi, LocalDateTime ngaylaphd, BigDecimal tongthanhtien, String tenkh, String diachi, String dt , String madk){
        this.mahd=mahd;
        this.ky=ky;
        this.chisodau=chisodau;
        this.chisocuoi=chisocuoi;
        this.ngaylaphd=ngaylaphd;
        this.tongthanhtien=tongthanhtien;
        this.tenkh=tenkh;
        this.diachi=diachi;
        this.dt=dt;
        this.madk=madk;
    }
}
