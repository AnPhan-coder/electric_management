import { Panel, PanelRaw, Field, Input, Select, Btn, BtnRow, Row, Col, Pill, Th, Td } from "../components/UI";
import { DK_LIST } from "../data/mockData";

export default function TabDK() {
  return (
    <div className="p-3.5">
      <Panel title="Thông tin điện kế">
        <Row>
          <Col flex={1} min={120}>
            <Field label="Mã điện kế" required hint="Đúng 8 chữ số">
              <Input placeholder="12345678" maxLength={8} />
            </Field>
          </Col>
          <Col flex={1} min={120}>
            <Field label="Mã khách hàng" required>
              <Input placeholder="KH0000000000142" />
            </Field>
          </Col>
          <Col flex={1} min={120}>
            <Field label="Ngày sản xuất" required>
              <Input type="date" />
            </Field>
          </Col>
          <Col flex={1} min={120}>
            <Field label="Ngày lắp" required hint="Phải sau ngày SX">
              <Input type="date" />
            </Field>
          </Col>
        </Row>
        <Row>
          <Col flex={2} min={180}>
            <Field label="Mô tả" required>
              <Input placeholder="Điện kế 1 pha..." />
            </Field>
          </Col>
          <Col flex={1} min={120}>
            <Field label="Trạng thái">
              <Select>
                <option value="1">Còn sử dụng</option>
                <option value="0">Ngừng sử dụng</option>
              </Select>
            </Field>
          </Col>
        </Row>
        <BtnRow>
          <Btn variant="primary">Thêm</Btn>
          <Btn>Sửa</Btn>
          <Btn variant="danger" onClick={() => { if (confirm("Xóa?")) alert("Đã xóa!"); }}>Xóa</Btn>
          <Btn>Làm mới</Btn>
        </BtnRow>
      </Panel>

      <PanelRaw title="Danh sách điện kế">
        <div className="px-3.5 pt-3">
          <div className="flex gap-2 items-end mb-3">
            <Field label="Mã điện kế"><Input placeholder="Nhập mã ĐK..." /></Field>
            <Field label="Mã KH"><Input placeholder="Nhập mã KH..." /></Field>
            <Btn variant="primary">Tìm</Btn>
          </div>
        </div>
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr>
              <Th>Mã ĐK</Th><Th>Mã KH</Th><Th>Họ tên KH</Th><Th>Ngày SX</Th><Th>Ngày lắp</Th><Th>Mô tả</Th><Th>Trạng thái</Th>
            </tr>
          </thead>
          <tbody>
            {DK_LIST.map((dk) => (
              <tr key={dk.madk} className="hover:bg-neutral-700/40 transition-colors">
                <Td className="font-medium text-red-400">{dk.madk}</Td>
                <Td>{dk.makh}</Td>
                <Td>{dk.tn}</Td>
                <Td>{dk.ngaysx}</Td>
                <Td>{dk.ngaylap}</Td>
                <Td>{dk.mota}</Td>
                <Td><Pill status={dk.status} /></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </PanelRaw>
    </div>
  );
}