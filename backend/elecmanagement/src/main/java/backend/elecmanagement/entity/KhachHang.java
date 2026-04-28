package backend.elecmanagement.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KhachHang {
    @Id
    @Column(columnDefinition = "varchar(13)", nullable = false)
    private String makh;
    @Column(columnDefinition = "nvarchar(50)")
    private String tenkh;
    @Column(columnDefinition = "nvarchar(100)")
    private String diachi;
    @Column(length = 10)
    private String dt;
    @Column(length = 12)
    private String cmnd;
    @Column(name = "trangthai", columnDefinition = "bit default 1")
    private Boolean trangthai;
}