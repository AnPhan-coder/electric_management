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

    private void saveHistorySnapshot(List<GiaDien> bangGia) {
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
    }

    @Override
    @Transactional
    public void deleteBacCaoNhat(Integer mabac) {
        List<GiaDien> bangGia = giaDienReponsitory.findAllOrderByMabacAsc();

        if (bangGia.size() <= 1) {
            throw new RuntimeException("Cần duy trì ít nhất 1 bậc giá, không thể xóa bậc cuối cùng");
        }

        GiaDien highestBac = bangGia.get(bangGia.size() - 1);

        if (highestBac.getMabac() != mabac) {
            throw new RuntimeException("Chỉ được phép xóa bậc cao nhất hiện tại (Bậc " + highestBac.getMabac() + ")");
        }

        saveHistorySnapshot(bangGia);

        giaDienReponsitory.delete(highestBac);

        GiaDien newHighestBac = bangGia.get(bangGia.size() - 2);
        newHighestBac.setDensokw(null);
        newHighestBac.setNgayapdung(java.time.LocalDateTime.now());
        giaDienReponsitory.save(newHighestBac);
    }

    @Override
    @Transactional
    public void themBacCaoNhat(backend.elecmanagement.dto.request.ThemBacRequest request) {
        if (request.getDongiaBacMoi() == null || request.getDongiaBacMoi().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Đơn giá bậc mới phải lớn hơn 0");
        }
        if (request.getDensokwBacHienTai() == null) {
            throw new RuntimeException("Phải nhập cận trên (kWh) cho bậc hiện tại");
        }

        List<GiaDien> bangGia = giaDienReponsitory.findAllOrderByMabacAsc();
        if (bangGia.isEmpty()) {
            throw new RuntimeException("Chưa có bảng giá cơ sở");
        }

        GiaDien highestBac = bangGia.get(bangGia.size() - 1);

        if (request.getDensokwBacHienTai() < highestBac.getTusokw()) {
            throw new RuntimeException("Cận trên mới (" + request.getDensokwBacHienTai() + ") không được nhỏ hơn cận dưới của bậc hiện tại (" + highestBac.getTusokw() + ")");
        }

        if (request.getDongiaBacMoi().compareTo(highestBac.getDongia()) <= 0) {
            throw new RuntimeException("Theo quy định giá điện bậc thang, đơn giá bậc mới (" + request.getDongiaBacMoi() + "đ) phải cao hơn đơn giá bậc liền trước (" + highestBac.getDongia() + "đ)");
        }

        saveHistorySnapshot(bangGia);

        java.time.LocalDateTime ngayThayDoi = java.time.LocalDateTime.now();

        highestBac.setDensokw(request.getDensokwBacHienTai());
        highestBac.setNgayapdung(ngayThayDoi);
        giaDienReponsitory.save(highestBac);

        GiaDien newBac = new GiaDien();
        newBac.setMabac(highestBac.getMabac() + 1);
        newBac.setTenbac("Bậc " + newBac.getMabac());
        newBac.setTusokw(request.getDensokwBacHienTai() + 1);
        newBac.setDensokw(null);
        newBac.setDongia(request.getDongiaBacMoi());
        newBac.setNgayapdung(ngayThayDoi);
        giaDienReponsitory.save(newBac);
    }
}
