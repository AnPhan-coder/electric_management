import { useState } from "react";
import { Panel, Field, Input, Btn, BtnRow, Alert, Pill, Th, Td } from "../components/UI";
import { KHD, DKD } from "../data/mockData";

const NO_LIST = [
  { makh: "KH0000000000207", tn: "Trần Thị Bảo",  mahd: "HD2025030207", ky: "03/2025", no: 621500, status: "unpaid" },
  { makh: "KH0000000000315", tn: "Phạm Đức Dũng", mahd: "HD2025020315", ky: "02/2025", no: 893700, status: "overdue" },
];

export default function TabTra() {
  const [maKH, setMaKH]   = useState("");
  const [maDK, setMaDK]   = useState("");
  const [result, setResult] = useState(null);
  const [title, setTitle]   = useState("Kết quả tra cứu");

  const trKH = () => {
    const inf = KHD[maKH.trim().toUpperCase()];
    if (inf) {
      setTitle("Kết quả — Khách hàng");
      setResult({ type: "kh", ma: maKH.trim().toUpperCase(), ...inf });
    } else {
      setTitle("Kết quả tra cứu");
      setResult({ type: "empty", msg: `Không tìm thấy mã KH "${maKH}"` });
    }
  };

  const trDK = () => {
    const inf = DKD[maDK.trim()];
    if (inf) {
      setTitle("Kết quả — Điện kế");
      setResult({ type: "dk", ma: maDK.trim(), ...inf });
    } else {
      setTitle("Kết quả tra cứu");
      setResult({ type: "empty", msg: `Không tìm thấy điện kế "${maDK}"` });
    }
  };

  const showNo = () => {
    setTitle("Danh sách khách hàng nợ tiền điện");
    setResult({ type: "no" });
  };

  const clr = () => {
    setResult(null);
    setTitle("Kết quả tra cứu");
  };

  const fmt = (n) => n.toLocaleString("vi-VN");

  return (
    <div className="p-3.5">
      <div className="flex gap-2.5 flex-wrap items-start">
        <div style={{ flex: 1, minWidth: 200 }}>
          <Panel title="Tra cứu khách hàng">
            <Field label="Mã khách hàng">
              <Input value={maKH} onChange={(e) => setMaKH(e.target.value)} placeholder="Nhập mã KH..." />
            </Field>
            <BtnRow>
              <Btn variant="primary" onClick={trKH}>Tìm</Btn>
              <Btn onClick={clr}>Xóa</Btn>
            </BtnRow>
          </Panel>

          <Panel title="Tra cứu điện kế">
            <Field label="Mã điện kế">
              <Input value={maDK} onChange={(e) => setMaDK(e.target.value)} placeholder="Nhập mã ĐK..." />
            </Field>
            <BtnRow>
              <Btn variant="primary" onClick={trDK}>Tìm</Btn>
            </BtnRow>
          </Panel>

          <Panel title="Theo dõi nợ tiền điện">
            <Alert variant="warning">Có <strong>161</strong> KH chưa thanh toán đúng hạn</Alert>
            <Btn variant="primary" onClick={showNo}>Xem danh sách nợ</Btn>
          </Panel>
        </div>

        <div style={{ flex: 2, minWidth: 260 }}>
          <div className="bg-neutral-800 border border-neutral-800 rounded-xl overflow-hidden mb-3">
            <div className="px-3.5 py-2.5 border-b border-neutral-700 bg-neutral-800/50">
              <span className="text-[13px] font-medium text-white">{title}</span>
            </div>
            <div>
              {!result && (
                <div className="px-3.5 py-10 text-center text-neutral-500 text-[13px]">
                  Chọn loại tra cứu và nhập thông tin bên trái
                </div>
              )}
              {result?.type === "empty" && (
                <div className="px-3.5 py-10 text-center text-neutral-500 text-[13px]">{result.msg}</div>
              )}
              {result?.type === "kh" && (
                <table className="w-full border-collapse text-[12px]">
                  <thead><tr><Th>Trường</Th><Th>Giá trị</Th></tr></thead>
                  <tbody>
                    {[["Mã KH", result.ma, true], ["Họ tên", result.tn], ["Địa chỉ", result.dc], ["Mã điện kế", result.dk], ["Chỉ số đầu", result.cd]].map(([l, v, bold]) => (
                      <tr key={l} className="hover:bg-neutral-700/40">
                        <Td>{l}</Td>
                        <Td className={bold ? "font-medium text-red-400" : ""}>{v}</Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {result?.type === "dk" && (
                <table className="w-full border-collapse text-[12px]">
                  <thead><tr><Th>Trường</Th><Th>Giá trị</Th></tr></thead>
                  <tbody>
                    {[["Mã ĐK", result.ma, true], ["Mã KH", result.makh], ["Khách hàng", result.tn], ["Ngày SX", result.ngaysx], ["Ngày lắp", result.ngaylap], ["Mô tả", result.mota]].map(([l, v, bold]) => (
                      <tr key={l} className="hover:bg-neutral-700/40">
                        <Td>{l}</Td>
                        <Td className={bold ? "font-medium text-red-400" : ""}>{v}</Td>
                      </tr>
                    ))}
                    <tr className="hover:bg-neutral-700/40">
                      <Td>Trạng thái</Td>
                      <Td><Pill status="using" /></Td>
                    </tr>
                  </tbody>
                </table>
              )}
              {result?.type === "no" && (
                <table className="w-full border-collapse text-[12px]">
                  <thead>
                    <tr><Th>Mã KH</Th><Th>Họ tên</Th><Th>Mã HĐ</Th><Th>Kỳ</Th><Th>Số nợ</Th><Th>Tình trạng</Th></tr>
                  </thead>
                  <tbody>
                    {NO_LIST.map((n) => (
                      <tr key={n.mahd} className="hover:bg-neutral-700/40">
                        <Td className="font-medium text-red-400">{n.makh}</Td>
                        <Td>{n.tn}</Td>
                        <Td>{n.mahd}</Td>
                        <Td>{n.ky}</Td>
                        <Td className="font-medium">{fmt(n.no)}đ</Td>
                        <Td><Pill status={n.status} /></Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}