package backend.elecmanagement.service;

import backend.elecmanagement.dto.request.GiaDienUpdateRequest;
import backend.elecmanagement.entity.GiaDien;
import backend.elecmanagement.entity.LichSuGiaDien;

import java.util.List;

public interface GiaDienService {

    List<GiaDien> getBangGiaHienTai();

    void updateBangGia(List<GiaDienUpdateRequest> updates);

    List<LichSuGiaDien> getDanhSachPhienLichSu();

    List<LichSuGiaDien> getChiTietPhien(Integer malichsuDaiDien);

    void deleteBacCaoNhat(Integer mabac);

    void themBacCaoNhat(backend.elecmanagement.dto.request.ThemBacRequest request);
}
