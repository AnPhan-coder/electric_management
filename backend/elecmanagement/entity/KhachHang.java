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
    @Column(name = "makh", columnDefinition = "varchar(13)", nullable = false)
    private String maKh;

    @Column(name = "tenkh", columnDefinition = "nvarchar(50)")
    private String tenKh;

    @Column(name = "diachi", columnDefinition = "nvarchar(100)")
    private String diaChi;

    @Column(name = "dt", columnDefinition = "nvarchar(12)")
    private String dt;

    @Column(name = "cmnd", columnDefinition = "varchar(9)")
    private String cmnd;
}