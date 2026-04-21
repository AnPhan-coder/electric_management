package backend.elecmanagement.service.impl;

import backend.elecmanagement.entity.KhachHang;
import backend.elecmanagement.reponsitory.KhachHangReponsitory;
import backend.elecmanagement.service.KhachHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class KhachHangServiceImpl implements KhachHangService {

    @Autowired
    private KhachHangReponsitory khachHangReponsitory;

    @Override
    public List<KhachHang> getAllKhachHang() {
        return khachHangReponsitory.findAll();
    }

    @Override
    public Map<String, Object> getKhachHangChiTiet(String maKh) {
        KhachHang kh = khachHangReponsitory.findById(maKh).orElse(null);
        if (kh == null) return null;

        List<String> danhSachDienKe = khachHangReponsitory.findDanhSachDienKeByMaKh(maKh);

        Map<String, Object> result = new HashMap<>();
        result.put("khachHang", kh);
        result.put("dienKeSoHuu", danhSachDienKe);
        return result;
    }

    @Override
    public KhachHang createKhachHang(KhachHang khachHang) throws Exception {
        if (khachHangReponsitory.existsById(khachHang.getMaKh())) {
            throw new Exception("Trùng mã khách hàng! Vui lòng nhập mã khác.");
        }
        return khachHangReponsitory.save(khachHang);
    }

    @Override
    public KhachHang updateKhachHang(String maKh, KhachHang thongTinMoi) {
        return khachHangReponsitory.findById(maKh).map(kh -> {
            kh.setTenKh(thongTinMoi.getTenKh());
            kh.setDiaChi(thongTinMoi.getDiaChi());
            kh.setDt(thongTinMoi.getDt());
            kh.setCmnd(thongTinMoi.getCmnd());
            return khachHangReponsitory.save(kh);
        }).orElse(null);
    }

    @Override
    public void ngungDichVuKhachHang(String maKh) throws Exception {
        int soHoaDonNo = khachHangReponsitory.countHoaDonChuaThanhToan(maKh);
        if (soHoaDonNo > 0) {
            throw new Exception("Phải thanh toán hết nợ trước khi ngừng dịch vụ!");
        }

        KhachHang kh = khachHangReponsitory.findById(maKh)
                .orElseThrow(() -> new Exception("Không tìm thấy khách hàng"));
    }
}