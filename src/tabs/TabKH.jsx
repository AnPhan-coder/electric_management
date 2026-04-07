import { useState } from "react";
import { Panel, PanelRaw, Field, Input, Btn, BtnRow, Row, Col, Th, Td } from "../components/UI";

const INIT_KH = [
  { ma: "KH0000000000142", tn: "Nguyễn Văn An", dc: "123 Lê Lợi, Q1, TP.HCM", dt: "0901234567", cm: "123456789" },
  { ma: "KH0000000000207", tn: "Trần Thị Bảo",  dc: "45 Nguyễn Huệ, Q1, TP.HCM", dt: "0912345678", cm: "987654321" },
  { ma: "KH0000000000315", tn: "Phạm Đức Dũng", dc: "78 Trần Hưng Đạo, Q5, TP.HCM", dt: "0978123456", cm: "456789123" },
];

export default function TabKH() {
  const [form, setForm] = useState({ ma: "", tn: "", dc: "", dt: "", cm: "" });
  const [search, setSearch] = useState("");
  const [list] = useState(INIT_KH);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const filtered = list.filter(
    (kh) =>
      kh.ma.toLowerCase().includes(search.toLowerCase()) ||
      kh.tn.toLowerCase().includes(search.toLowerCase())
  );

  const sel = (kh) => setForm({ ma: kh.ma, tn: kh.tn, dc: kh.dc, dt: kh.dt, cm: kh.cm });
  const clr = () => setForm({ ma: "", tn: "", dc: "", dt: "", cm: "" });

  const add = () => {
    if (!form.ma || form.ma.length !== 13) { alert("Mã KH phải đúng 13 ký tự!"); return; }
    if (!form.tn) { alert("Tên KH không được để trống!"); return; }
    alert("Đã thêm KH " + form.tn + " vào CSDL!");
  };

  return (
    <div className="p-3.5">
      <Panel title="Thông tin khách hàng" extra={<span><span className="text-red-500">*</span> bắt buộc</span>}>
        <Row>
          <Col flex={1} min={120}>
            <Field label="Mã KH" required hint="Đúng 13 ký tự">
              <Input id="k-ma" value={form.ma} onChange={set("ma")} placeholder="VD: KH0000000000001" maxLength={13} />
            </Field>
          </Col>
          <Col flex={2} min={180}>
            <Field label="Họ tên KH" required>
              <Input id="k-ten" value={form.tn} onChange={set("tn")} placeholder="Nguyễn Văn A" />
            </Field>
          </Col>
        </Row>
        <Row>
          <Col flex={2} min={180}>
            <Field label="Địa chỉ" required>
              <Input id="k-dc" value={form.dc} onChange={set("dc")} placeholder="Số nhà, đường, phường, quận, TP" />
            </Field>
          </Col>
          <Col flex={1} min={120}>
            <Field label="Điện thoại" required hint="Chỉ nhập số">
              <Input id="k-dt" value={form.dt} onChange={set("dt")} placeholder="0901234567" />
            </Field>
          </Col>
          <Col flex={1} min={120}>
            <Field label="CMND" required hint="9 chữ số">
              <Input id="k-cm" value={form.cm} onChange={set("cm")} placeholder="123456789" maxLength={9} />
            </Field>
          </Col>
        </Row>
        <BtnRow>
          <Btn variant="primary" onClick={add}>Thêm</Btn>
          <Btn onClick={() => alert("Đã cập nhật thông tin khách hàng!")}>Sửa</Btn>
          <Btn variant="danger" onClick={() => { if (confirm("Xác nhận xóa khách hàng này?")) alert("Đã xóa!"); }}>Xóa</Btn>
          <Btn onClick={clr}>Làm mới</Btn>
        </BtnRow>
      </Panel>

      <PanelRaw title="Danh sách khách hàng">
        <div className="px-3.5 pt-3 pb-0">
          <div className="flex gap-2 items-end mb-3">
            <Field label="Tìm theo mã / tên" style={{ flex: 1, marginBottom: 0 }}>
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nhập mã KH hoặc tên..." />
            </Field>
            <Btn variant="primary" className="mb-0" onClick={() => {}}>Tìm</Btn>
          </div>
        </div>
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr>
              <Th>Mã KH</Th><Th>Họ tên</Th><Th>Địa chỉ</Th><Th>Điện thoại</Th><Th>CMND</Th><Th></Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((kh) => (
              <tr
                key={kh.ma}
                className="cursor-pointer hover:bg-neutral-700/40 transition-colors"
                onClick={() => sel(kh)}
              >
                <Td className="font-medium text-red-400">{kh.ma}</Td>
                <Td>{kh.tn}</Td>
                <Td>{kh.dc.split(",").slice(0, 2).join(",")}</Td>
                <Td>{kh.dt}</Td>
                <Td>{kh.cm}</Td>
                <Td>
                  <Btn size="sm" variant="danger" onClick={(e) => { e.stopPropagation(); if (confirm("Xóa?")) alert("Đã xóa!"); }}>
                    Xóa
                  </Btn>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </PanelRaw>
    </div>
  );
}