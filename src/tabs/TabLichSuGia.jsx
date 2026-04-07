import { useState } from "react";
import { Panel, PanelRaw, Pill, Th, Td, Alert } from "../components/UI";
import { LICH_SU_GIA } from "../data/mockData";

export default function TabLichSuGia() {
  const [selected, setSelected] = useState(LICH_SU_GIA[0]);

  return (
    <div className="p-3.5">
      <Alert variant="info">
        Lịch sử bảng giá điện các thay đổi theo thời gian. Tra cứu để xem các biểu giá này được áp dụng đến khi nào.
      </Alert>
      <div className="flex gap-2.5 flex-wrap items-start">
        <div style={{ flex: 1, minWidth: 300 }}>
          <PanelRaw title="Danh sách các đợt thay đổi giá điện">
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr>
                  <Th>Quyết định</Th>
                  <Th>Thời điểm áp dụng</Th>
                  <Th>Trạng thái</Th>
                </tr>
              </thead>
              <tbody>
                {LICH_SU_GIA.map((item) => (
                  <tr
                    key={item.id}
                    className={`cursor-pointer transition-colors ${selected.id === item.id ? "bg-neutral-700/60" : "hover:bg-neutral-700/40"}`}
                    onClick={() => setSelected(item)}
                  >
                    <Td className="font-medium text-red-400">{item.ten}</Td>
                    <Td>
                      {item.ngayApDung} <span className="text-neutral-500">→</span> {item.ngayKetThuc}
                    </Td>
                    <Td>
                      <Pill status={item.trangThai === "active" ? "active" : "inactive"} />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </PanelRaw>
        </div>

        <div style={{ flex: 1, minWidth: 260 }}>
          {selected ? (
            <Panel title={`Chi tiết bảng giá: ${selected.ten}`}>
              <div className="mb-4 text-[12px]">
                <div className="mb-1"><span className="text-neutral-500">Ký hiệu QĐ: </span><span className="font-medium text-white">{selected.id}</span></div>
                <div className="mb-1"><span className="text-neutral-500">Ngày bắt đầu áp dụng: </span><span className="font-medium text-white">{selected.ngayApDung}</span></div>
                <div><span className="text-neutral-500">Ngày kết thúc: </span><span className="font-medium text-white">{selected.ngayKetThuc}</span></div>
              </div>
              <div className="border border-neutral-700 rounded-lg overflow-hidden">
                <table className="w-full border-collapse text-[12px]">
                  <thead>
                    <tr>
                      <Th>Bậc</Th>
                      <Th>Khoảng kWh</Th>
                      <Th>Đơn giá (đ/kWh)</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.chiTiet.map((g, i) => (
                      <tr key={i} className="hover:bg-neutral-700/30 transition-colors">
                        <Td className="font-medium">{g.bac}</Td>
                        <Td>{g.den ? `${g.tu} – ${g.den}` : `> ${g.tu}`}</Td>
                        <Td className="font-medium text-red-400">{g.gia.toLocaleString("vi-VN")}</Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          ) : (
            <div className="text-neutral-500 text-[13px] pt-10 text-center">
              Chọn một quyết định để xem chi tiết bảng giá
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
