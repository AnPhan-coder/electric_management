package backend.elecmanagement.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DienKe {
    @Id
    @Column(columnDefinition = "varchar(8)", nullable = false)
    private String madk;

    @Column(name = "makh", columnDefinition = "varchar(13)")
    private String makh;

    private LocalDateTime ngaysx;
    private LocalDateTime ngaylap;

    @Column(columnDefinition = "nvarchar(100)")
    private String mota;
    private Boolean trangthai;

    @Column(columnDefinition = "nvarchar(200)")
    private String diachi;
}