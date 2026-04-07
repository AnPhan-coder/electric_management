import { Panel, PanelRaw, Field, Input, Btn, BtnRow, Row, Col, Alert, Th, Td } from "../components/UI";
import { GIA_LIST } from "../data/mockData";

export default function TabGia() {
  return (
    <div className="p-3.5">
      <Alert variant="info">
        Giá điện mới nhất luôn được áp dụng khi tính hóa đơn. Cập nhật khi có Quyết định / Thông tư của Bộ Công Thương.
      </Alert>
      <div className="flex gap-2.5 flex-wrap items-start">
        <div style={{ flex: 1, minWidth: 200 }}>
          <Panel title="Sửa bậc giá">
            <Row>
              <Col flex={1} min={80}>
                <Field label="Mã bậc" required>
                  <Input type="number" placeholder="1" />
                </Field>
              </Col>
              <Col flex={1} min={80}>
                <Field label="Tên bậc" required>
                  <Input placeholder="Bậc 1" />
                </Field>
              </Col>
            </Row>
            <Row>
              <Col flex={1} min={80}>
                <Field label="Từ kW" required>
                  <Input type="number" min={0} placeholder="0" />
                </Field>
              </Col>
              <Col flex={1} min={80}>
                <Field label="Đến kW" required>
                  <Input type="number" min={1} placeholder="100" />
                </Field>
              </Col>
            </Row>
            <Field label="Đơn giá (đ/kWh)" required>
              <Input type="number" placeholder="1242" />
            </Field>
            <Field label="Ngày áp dụng" required hint="Không sau ngày hôm nay">
              <Input type="date" />
            </Field>
            <BtnRow>
              <Btn variant="primary">Lưu</Btn>
              <Btn>Làm mới</Btn>
            </BtnRow>
          </Panel>
        </div>

        <div style={{ flex: 2, minWidth: 260 }}>
          <PanelRaw title="Giá bán lẻ điện sinh hoạt hiện hành" extra="Áp dụng từ 11/10/2023">
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr>
                  <Th>Bậc</Th><Th>Khoảng kWh</Th><Th>Đơn giá (đ/kWh)</Th><Th>Ngày áp dụng</Th><Th></Th>
                </tr>
              </thead>
              <tbody>
                {GIA_LIST.map((g, i) => (
                  <tr key={i} className="hover:bg-neutral-700/40 transition-colors">
                    <Td className="font-medium">{g.bac}</Td>
                    <Td>{g.den ? `${g.tu} – ${g.den}` : `> ${g.tu}`}</Td>
                    <Td className="font-medium text-red-400">{g.gia.toLocaleString("vi-VN")}</Td>
                    <Td>{g.ngay}</Td>
                    <Td><Btn size="sm">Sửa</Btn></Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </PanelRaw>
        </div>
      </div>
    </div>
  );
}