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
    @Column(columnDefinition = "nvarchar(12)")
    private String dt;
    @Column(columnDefinition = "varchar(9)")
    private String cmnd;
}