package backend.elecmanagement.service.impl;

import backend.elecmanagement.dto.request.KhachHangNoDTO;
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
import java.util.Optional;

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
    //Danh sách nợ
    @Override
    public List<KhachHangNoDTO> getDanhSachNo() {
        return hoaDonReponsitory.findDanhSachNo();
    }
    @Override
    public long demSoLuongKhachNo() {
        // Viết code đếm ở đây
        return hoaDonReponsitory.countKhachHangNo();
    }
    //
    @Transactional
    public HoaDon tinhTienDien(String madk, int chisocuoi, LocalDateTime denngay) {
        // 1. Kiểm tra rỗng và truy vấn Điện kế
        DienKe dienKe = dienKeReponsitory.findById(madk)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Điện kế"));

        // 2. Truy vấn hóa đơn kỳ trước lấy chỉ số đầu (SỬA Ở ĐÂY)
        List<HoaDon> previousBills = hoaDonReponsitory.findHistoryByMadk(madk);

        int chisodau = previousBills.isEmpty() ? 0 : previousBills.get(0).getChisocuoi();
        LocalDateTime tungay = previousBills.isEmpty() ? dienKe.getNgaylap() : previousBills.get(0).getDenngay();

        // 3. Kiểm tra logic chỉ số
        if (chisocuoi <= chisodau) {
            throw new RuntimeException("Lỗi: Chỉ số cuối phải lớn hơn chỉ số đầu");
        }

        // 4. Tính toán điện năng tiêu thụ và tạo hóa đơn
        int dnttTong = chisocuoi - chisodau;
        int dnttConLai = dnttTong;
        BigDecimal tongThanhTien = BigDecimal.ZERO;

        String mahd = "HD" + (System.currentTimeMillis() % 100000000);
        String ky = denngay.format(DateTimeFormatter.ofPattern("MM/yyyy"));

        List<GiaDien> bangGia = giaDienReponsitory.findAllOrderByMabacAsc();
        List<CtHoaDon> dsChiTiet = new ArrayList<>();

        for (GiaDien bac : bangGia) {
            if (dnttConLai <= 0) break;

            int limitTu = bac.getTusokw();
            int limitDen = (bac.getDensokw() != null) ? bac.getDensokw() : Integer.MAX_VALUE;
            int limitKw = limitDen - limitTu + 1;
            if(bac.getTusokw() == 0) limitKw = limitDen;

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

        hoaDonReponsitory.save(hoaDon);
        ctHoaDonReponsitory.saveAll(dsChiTiet);

        return hoaDon;
    }
}
