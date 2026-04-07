import { useState } from "react";
import { Panel, Field, Input, Btn, BtnRow, Row, Col } from "../components/UI";
import { KHD, GIA } from "../data/mockData";

export default function TabTT() {
  const [form, setForm] = useState({ ma: "", ky: "", td: "", dd: "", cd: "", cc: "" });
  const [info, setInfo] = useState(null);
  const [result, setResult] = useState(null);

  const set = (k) => (e) => {
    const val = e.target.value;
    setForm((f) => ({ ...f, [k]: val }));
    if (k === "ma") lookupKH(val);
    if (k === "cc") calcAuto({ ...form, cc: val });
  };

  const lookupKH = (ma) => {
    const inf = KHD[ma.trim().toUpperCase()];
    if (inf) { setInfo(inf); setForm((f) => ({ ...f, cd: String(inf.cd) })); }
    else { setInfo(null); }
  };

  const calcAuto = (f) => {
    const inf = KHD[f.ma.trim().toUpperCase()];
    if (!inf || !f.cc) return;
    const cc = parseInt(f.cc) || 0, cd = inf.cd;
    if (cc <= cd) return;
    runCalc(f.ky || "03/2025", cc, cd, inf);
  };

  const calc = () => {
    const ma = form.ma.trim().toUpperCase();
    const inf = KHD[ma];
    if (!inf) { alert("Không tìm thấy mã KH!"); return; }
    const cc = parseInt(form.cc) || 0, cd = inf.cd;
    if (cc <= cd) { alert("Chỉ số cuối phải lớn hơn chỉ số đầu!"); return; }
    runCalc(form.ky || "03/2025", cc, cd, inf);
  };

  const runCalc = (ky, cc, cd, inf) => {
    const dn = cc - cd;
    let rows = [], tot = 0, rem = dn;
    for (let i = 0; i < GIA.length; i++) {
      const b = GIA[i];
      if (rem <= 0) break;
      const rng = b.den >= 1e9 ? rem : Math.min(rem, b.den - b.tu + 1);
      const kwh = Math.min(rem, rng);
      const tt = kwh * b.g;
      tot += tt;
      rows.push({ bac: `Bậc ${i + 1}`, range: b.den >= 1e9 ? `> ${b.tu}` : `${b.tu} – ${b.den}`, kwh, gia: b.g, tt });
      rem -= kwh;
    }
    setResult({
      ky, ma: form.ma.trim().toUpperCase(),
      tn: inf.tn, dc: inf.dc, cd, cc, dn,
      mahd: "HD" + Date.now().toString().slice(-8),
      rows, tot,
    });
  };

  const clr = () => {
    setForm({ ma: "", ky: "", td: "", dd: "", cd: "", cc: "" });
    setInfo(null);
    setResult(null);
  };

  const fmt = (n) => n.toLocaleString("vi-VN");

  return (
    <div className="p-3.5">
      <div className="flex gap-2.5 flex-wrap items-start">
        <div style={{ flex: 1, minWidth: 220 }}>
          <Panel title="Nhập chỉ số điện kế">
            <Field label="Mã KH" required>
              <input
                className="w-full text-[12px] px-2.5 py-1.5 border border-neutral-700 rounded-lg bg-neutral-900 text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500"
                value={form.ma}
                onChange={set("ma")}
                placeholder="KH0000000000142"
              />
            </Field>
            {info && (
              <div className="bg-neutral-700/40 rounded-lg px-2.5 py-2 mb-2 text-[12px]">
                <div className="font-medium text-white">{info.tn}</div>
                <div className="text-neutral-500 text-[11px]">{info.dc}</div>
                <div className="text-neutral-500 text-[11px]">Mã ĐK: {info.dk}</div>
              </div>
            )}
            <Field label="Kỳ hóa đơn" required>
              <Input value={form.ky} onChange={set("ky")} placeholder="mm/yyyy — VD: 03/2025" />
            </Field>
            <Row>
              <Col flex={1} min={100}>
                <Field label="Từ ngày"><Input type="date" value={form.td} onChange={set("td")} /></Field>
              </Col>
              <Col flex={1} min={100}>
                <Field label="Đến ngày"><Input type="date" value={form.dd} onChange={set("dd")} /></Field>
              </Col>
            </Row>
            <Row>
              <Col flex={1} min={100}>
                <Field label="Chỉ số đầu" required hint="Lấy từ kỳ trước">
                  <Input type="number" value={form.cd} readOnly className="bg-neutral-800" placeholder="Tự động" />
                </Field>
              </Col>
              <Col flex={1} min={100}>
                <Field label="Chỉ số cuối" required>
                  <Input type="number" value={form.cc} onChange={set("cc")} placeholder="Nhập chỉ số mới" />
                </Field>
              </Col>
            </Row>
            <BtnRow>
              <Btn variant="primary" onClick={calc}>Tính tiền</Btn>
              <Btn onClick={clr}>Làm mới</Btn>
            </BtnRow>
          </Panel>
        </div>

        <div style={{ flex: 1.5, minWidth: 260 }}>
          {!result ? (
            <div className="text-neutral-500 text-[13px] pt-10 text-center">
              Nhập mã KH và chỉ số cuối, rồi nhấn "Tính tiền"
            </div>
          ) : (
            <div className="border border-neutral-700 rounded-xl p-4 bg-neutral-900">
              <div className="flex justify-between items-start mb-3.5 pb-3 border-b border-neutral-800">
                <div>
                  <div className="text-[14px] font-medium text-white">CÔNG TY ĐIỆN LỰC</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">Giấy báo tiền điện tháng {result.ky}</div>
                </div>
                <div className="text-[12px] text-neutral-400 text-right">
                  Mã HĐ:<br />
                  <strong className="text-white text-[13px]">{result.mahd}</strong>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-3 text-[12px]">
                {[
                  ["Khách hàng", result.tn], ["Mã KH", result.ma],
                  ["Địa chỉ", result.dc], ["Kỳ", result.ky],
                  ["Chỉ số đầu", result.cd], ["Chỉ số cuối", result.cc],
                  ["Tiêu thụ", <span className="text-red-400 font-medium">{result.dn} kWh</span>],
                ].map(([l, v], i) => (
                  <div key={i}><span className="text-neutral-500">{l}: </span><span className="font-medium text-white">{v}</span></div>
                ))}
              </div>
              <table className="w-full border-collapse text-[12px] mb-3">
                <thead>
                  <tr>
                    {["Bậc","Khoảng kWh","kWh tính","Đơn giá","Thành tiền"].map((h) => (
                      <th key={h} className="bg-neutral-800 px-2 py-1.5 text-left text-[11px] font-medium text-neutral-400 border border-neutral-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((r, i) => (
                    <tr key={i}>
                      <td className="px-2 py-1.5 border border-neutral-800 text-white">{r.bac}</td>
                      <td className="px-2 py-1.5 border border-neutral-800 text-white">{r.range} kWh</td>
                      <td className="px-2 py-1.5 border border-neutral-800 text-white">{r.kwh}</td>
                      <td className="px-2 py-1.5 border border-neutral-800 text-white">{fmt(r.gia)}đ</td>
                      <td className="px-2 py-1.5 border border-neutral-800 text-white">{fmt(r.tt)}đ</td>
                    </tr>
                  ))}
                  <tr className="bg-neutral-800/50">
                    <td colSpan={4} className="px-2 py-1.5 border border-neutral-800 text-right font-medium text-white">Tổng cộng</td>
                    <td className="px-2 py-1.5 border border-neutral-800 font-medium text-white">{fmt(result.tot)}đ</td>
                  </tr>
                </tbody>
              </table>
              <div className="flex justify-end items-center gap-4 pt-2.5 border-t border-neutral-800">
                <span className="text-[13px] text-neutral-400">Tổng tiền (chưa VAT):</span>
                <span className="text-[18px] font-medium text-red-400">{fmt(result.tot)}đ</span>
              </div>
              <BtnRow>
                <Btn variant="success" onClick={() => alert("Đã lưu hóa đơn vào CSDL!")}>Lưu hóa đơn</Btn>
                <Btn onClick={() => alert("Đang in giấy báo...")}>In giấy báo</Btn>
              </BtnRow>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}