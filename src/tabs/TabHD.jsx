import { PanelRaw, Field, Input, Select, Btn, Pill, Th, Td } from "../components/UI";
import { INVOICES } from "../data/mockData";

const fmt = (n) => n.toLocaleString("vi-VN");

const STATS = [
  { label: "Tổng HĐ tháng 3", value: "1.248", sub: "hóa đơn", color: "" },
  { label: "Đã thanh toán",   value: "1.087", sub: "87% tỷ lệ thu", color: "text-green-400" },
  { label: "Chưa TT / quá hạn", value: "161", sub: "cần theo dõi",  color: "text-red-400" },
];

export default function TabHD() {
  return (
    <div className="p-3.5">
      <div className="grid grid-cols-3 gap-2.5 mb-3">
        {STATS.map((s) => (
          <div key={s.label} className="bg-neutral-800 border border-neutral-800 rounded-xl px-3.5 py-3">
            <div className="text-[10px] text-neutral-500 uppercase tracking-wide mb-1">{s.label}</div>
            <div className={`text-[19px] font-medium ${s.color || "text-white"}`}>{s.value}</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      <PanelRaw title="Danh sách hóa đơn">
        <div className="px-3.5 pt-3">
          <div className="flex gap-2 items-end mb-3 flex-wrap">
            <Field label="Kỳ"><Input placeholder="03/2025" defaultValue="03/2025" className="max-w-[110px]" /></Field>
            <Field label="Mã KH / Tên"><Input placeholder="Tìm..." /></Field>
            <Field label="Tình trạng">
              <Select className="max-w-[130px]">
                <option>Tất cả</option>
                <option>Đã thanh toán</option>
                <option>Chưa TT</option>
              </Select>
            </Field>
            <Btn variant="primary">Lọc</Btn>
            <Btn onClick={() => alert("In danh sách nợ!")}>In ds nợ</Btn>
          </div>
        </div>
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr>
              <Th>Mã HĐ</Th><Th>Kỳ</Th><Th>Khách hàng</Th><Th>Mã ĐK</Th>
              <Th>CS đầu</Th><Th>CS cuối</Th><Th>Tiêu thụ</Th>
              <Th>Tổng tiền</Th><Th>Tình trạng</Th><Th></Th>
            </tr>
          </thead>
          <tbody>
            {INVOICES.map((inv) => (
              <tr key={inv.mahd} className="hover:bg-neutral-700/40 transition-colors">
                <Td className="font-medium text-red-400">{inv.mahd}</Td>
                <Td>{inv.ky}</Td>
                <Td>{inv.tn}</Td>
                <Td>{inv.dk}</Td>
                <Td>{inv.cd.toLocaleString("vi-VN")}</Td>
                <Td>{inv.cc.toLocaleString("vi-VN")}</Td>
                <Td>{inv.dn} kWh</Td>
                <Td className="font-medium">{fmt(inv.tt)}đ</Td>
                <Td><Pill status={inv.status} /></Td>
                <Td>
                  <div className="flex gap-1">
                    <Btn size="sm">Xem</Btn>
                    {inv.status === "paid"    && <Btn size="sm" onClick={() => alert("Đã in!")}>In</Btn>}
                    {inv.status === "unpaid"  && <Btn size="sm" variant="success" onClick={() => alert("Thu tiền thành công!")}>Thu tiền</Btn>}
                    {inv.status === "overdue" && <Btn size="sm" variant="danger"  onClick={() => alert("Đã ghi nhận cắt điện!")}>Cắt điện</Btn>}
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </PanelRaw>
    </div>
  );
}