package backend.elecmanagement.service.impl;

import backend.elecmanagement.dto.request.CTHOADONNO;
import backend.elecmanagement.entity.*;
import backend.elecmanagement.reponsitory.CtHoaDonReponsitory;
import backend.elecmanagement.reponsitory.DienKeReponsitory;
import backend.elecmanagement.reponsitory.GiaDienReponsitory;
import backend.elecmanagement.reponsitory.HoaDonReponsitory;
import backend.elecmanagement.service.HoaDonService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class HoaDonServiceimpl implements HoaDonService {

    private final HoaDonReponsitory hoaDonReponsitory;
    private final CtHoaDonReponsitory ctHoaDonReponsitory;
    private final DienKeReponsitory dienKeReponsitory;
    private final GiaDienReponsitory giaDienReponsitory;

    public HoaDonServiceimpl(HoaDonReponsitory hoaDonReponsitory, CtHoaDonReponsitory ctHoaDonReponsitory,
            DienKeReponsitory dienKeReponsitory, GiaDienReponsitory giaDienReponsitory) {
        this.hoaDonReponsitory = hoaDonReponsitory;
        this.ctHoaDonReponsitory = ctHoaDonReponsitory;
        this.dienKeReponsitory = dienKeReponsitory;
        this.giaDienReponsitory = giaDienReponsitory;
    }

    @Transactional
    public HoaDon tinhTienDien(String madk, int chisocuoi, LocalDateTime denngay) {
        // Kiểm tra rỗng và truy vấn Điện kế
        DienKe dienKe = dienKeReponsitory.findById(madk)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Điện kế"));

        // Truy vấn hóa đơn kỳ trước lấy chỉ số đầu (SỬA Ở ĐÂY)
        List<HoaDon> previousBills = hoaDonReponsitory.findHistoryByMadk(madk);

        int chisodau = previousBills.isEmpty() ? 0 : previousBills.get(0).getChisocuoi();
        LocalDateTime tungay = previousBills.isEmpty() ? dienKe.getNgaylap() : previousBills.get(0).getDenngay();
        
        if (!denngay.isAfter(tungay)) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
            throw new RuntimeException(
                    "Ngày chốt số mới phải LỚN HƠN ngày chốt số kỳ trước (" + tungay.format(formatter) + ")");
        }
        // Kiểm tra logic chỉ số
        if (chisocuoi <= chisodau) {
            throw new RuntimeException("Lỗi: Chỉ số cuối phải lớn hơn chỉ số đầu");
        }

        // 4. Tính toán điện năng tiêu thụ và tạo hóa đơn
        int dnttTong = chisocuoi - chisodau;
        int dnttConLai = dnttTong;
        BigDecimal tongThanhTien = BigDecimal.ZERO;

        String mahd = "" + (System.currentTimeMillis() % 100000000);
        String ky = denngay.format(DateTimeFormatter.ofPattern("MM/yyyy"));

        List<GiaDien> bangGia = giaDienReponsitory.findAllOrderByMabacAsc();
        List<CtHoaDon> dsChiTiet = new ArrayList<>();

        for (GiaDien bac : bangGia) {
            if (dnttConLai <= 0)
                break;

            int limitTu = bac.getTusokw();
            int limitDen = (bac.getDensokw() != null) ? bac.getDensokw() : Integer.MAX_VALUE;
            int limitKw = limitDen - limitTu + 1;
            if (bac.getTusokw() == 0)
                limitKw = limitDen;

            int kwTinhToan = Math.min(dnttConLai, limitKw);
            BigDecimal thanhTienBac = bac.getDongia().multiply(new BigDecimal(kwTinhToan));
            tongThanhTien = tongThanhTien.add(thanhTienBac);
            dnttConLai -= kwTinhToan;

            // Tạo chi tiết
            CtHoaDon cthd = new CtHoaDon();
            cthd.setId(new CtHoaDonId(mahd, madk, bac.getMabac()));
            cthd.setDntt(kwTinhToan);
            cthd.setDongia(bac.getDongia());
            dsChiTiet.add(cthd);
        }

        // Lưu Hóa Đơn
        HoaDon hoaDon = new HoaDon();
        hoaDon.setMahd(mahd);
        hoaDon.setKy(ky);
        hoaDon.setTungay(tungay);
        hoaDon.setDenngay(denngay);
        hoaDon.setChisodau(chisodau);
        hoaDon.setChisocuoi(chisocuoi);
        hoaDon.setTongthanhtien(tongThanhTien);
        hoaDon.setNgaylaphd(LocalDateTime.now());
        hoaDon.setTinhtrang(false);
        hoaDon.setChiTiet(dsChiTiet);

        hoaDonReponsitory.save(hoaDon);
        ctHoaDonReponsitory.saveAll(dsChiTiet);

        return hoaDon;
    }

    @Override
    public List<CTHOADONNO> getDanhSachNo() {
        return hoaDonReponsitory.findDanhSachNo();
    }

    @Override
    public CTHOADONNO findChiTietByMaHD(String mahd) {
        // 1. Lấy thông tin chung (tên, địa chỉ, tổng tiền...) từ Repository hiện tại của bạn
        CTHOADONNO dto = hoaDonReponsitory.getChiTietHoaDon(mahd);

        if (dto != null) {
            // 2. Lấy danh sách các bậc thang điện (ct_hoa_don) từ DB
            List<CtHoaDon> danhSachBac = ctHoaDonReponsitory.findByIdMahd(mahd);

            // 3. Đổ danh sách bậc vào DTO để gửi về Frontend
            dto.setChiTiet(danhSachBac);
            return dto;
        }
        return null;
    }

    @Override
    @Transactional
    public void thanhToanHoaDon(String mahd) {
        HoaDon hoaDon = hoaDonReponsitory.findById(mahd)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn: " + mahd));
        hoaDon.setTinhtrang(true);
        hoaDonReponsitory.save(hoaDon);
    }
}
