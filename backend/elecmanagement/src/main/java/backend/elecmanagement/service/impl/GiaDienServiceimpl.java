package backend.elecmanagement.service.impl;

import backend.elecmanagement.dto.request.GiaDienUpdateRequest;
import backend.elecmanagement.entity.GiaDien;
import backend.elecmanagement.entity.LichSuGiaDien;
import backend.elecmanagement.reponsitory.GiaDienReponsitory;
import backend.elecmanagement.reponsitory.LichSuGiaDienReponsitory;
import backend.elecmanagement.service.GiaDienService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GiaDienServiceimpl implements GiaDienService {

    private final GiaDienReponsitory giaDienReponsitory;
    private final LichSuGiaDienReponsitory lichSuGiaDienReponsitory;

    public GiaDienServiceimpl(GiaDienReponsitory giaDienReponsitory,
                               LichSuGiaDienReponsitory lichSuGiaDienReponsitory) {
        this.giaDienReponsitory = giaDienReponsitory;
        this.lichSuGiaDienReponsitory = lichSuGiaDienReponsitory;
    }

    @Override
    public List<GiaDien> getBangGiaHienTai() {
        return giaDienReponsitory.findAllOrderByMabacAsc();
    }


    @Override
    @Transactional
    public void updateBangGia(List<GiaDienUpdateRequest> updates) {
        List<GiaDien> bangGia = giaDienReponsitory.findAllOrderByMabacAsc();

        Map<Integer, GiaDien> bangGiaMap = bangGia.stream()
                .collect(Collectors.toMap(GiaDien::getMabac, g -> g));

        // Lưu lịch sử bảng giá cũ TRƯỚC KHI cập nhật giá mới
        java.time.LocalDateTime ngayThayDoi = java.time.LocalDateTime.now();
        List<LichSuGiaDien> historyList = bangGia.stream().map(bac -> {
            LichSuGiaDien historyItem = new LichSuGiaDien();
            historyItem.setMabac(bac.getMabac());
            historyItem.setTenbac(bac.getTenbac());
            historyItem.setTusokw(bac.getTusokw());
            historyItem.setDensokw(bac.getDensokw());
            historyItem.setDongia(bac.getDongia());
            historyItem.setNgayapdung(bac.getNgayapdung());
            historyItem.setNgaythaydoi(ngayThayDoi);
            return historyItem;
        }).collect(Collectors.toList());
        lichSuGiaDienReponsitory.saveAll(historyList);

        for (GiaDienUpdateRequest req : updates) {
            GiaDien bac = bangGiaMap.get(req.getMabac());
            if (bac == null) {
                throw new RuntimeException("Không tìm thấy bậc mabac=" + req.getMabac());
            }
            if (req.getDongia() == null || req.getDongia().compareTo(java.math.BigDecimal.ZERO) <= 0) {
                throw new RuntimeException("Đơn giá bậc " + req.getMabac() + " phải lớn hơn 0");
            }
            bac.setDongia(req.getDongia());
            bac.setNgayapdung(ngayThayDoi);
        }

        // Cập nhật bản ghi bảng giá mới
        giaDienReponsitory.saveAll(bangGia);
    }

    @Override
    public List<LichSuGiaDien> getDanhSachPhienLichSu() {
        return lichSuGiaDienReponsitory.findDistinctPhienBang();
    }

    @Override
    public List<LichSuGiaDien> getChiTietPhien(Integer malichsuDaiDien) {
        return lichSuGiaDienReponsitory.findChiTietByMalichsuDaiDien(malichsuDaiDien);
    }
}
