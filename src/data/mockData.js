export const GIA_LIST = [
  { bac: 1, tu: 0, den: 50, gia: 1806, ngay: "11/10/2023" },
  { bac: 2, tu: 51, den: 100, gia: 1866, ngay: "11/10/2023" },
  { bac: 3, tu: 101, den: 200, gia: 2167, ngay: "11/10/2023" },
  { bac: 4, tu: 201, den: 300, gia: 2729, ngay: "11/10/2023" },
  { bac: 5, tu: 301, den: 400, gia: 3050, ngay: "11/10/2023" },
  { bac: 6, tu: 401, den: null, gia: 3151, ngay: "11/10/2023" },
];

export const GIA = [
  { tu: 1, den: 50, g: 1806 },
  { tu: 51, den: 100, g: 1866 },
  { tu: 101, den: 200, g: 2167 },
  { tu: 201, den: 300, g: 2729 },
  { tu: 301, den: 400, g: 3050 },
  { tu: 401, den: 1e9, g: 3151 },
];

export const KHD = {
  "KH0000000000142": { tn: "Nguyễn Văn An", dc: "123 Lê Lợi, Q1, TP.HCM", dk: "12345678", cd: 1542 },
  "KH0000000000207": { tn: "Trần Thị Bảo", dc: "45 Nguyễn Huệ, Q1, TP.HCM", dk: "87654321", cd: 2015 },
  "KH0000000000315": { tn: "Phạm Đức Dũng", dc: "78 Trần Hưng Đạo, Q5, TP.HCM", dk: "11223344", cd: 852 },
};

export const DK_LIST = [
  { madk: "12345678", makh: "KH0000000000142", tn: "Nguyễn Văn An", ngaysx: "15/01/2021", ngaylap: "05/03/2021", mota: "Điện kế 1 pha", status: "using" },
  { madk: "87654321", makh: "KH0000000000207", tn: "Trần Thị Bảo", ngaysx: "20/11/2020", ngaylap: "12/01/2021", mota: "Điện kế 3 pha", status: "using" },
  { madk: "11223344", makh: "KH0000000000315", tn: "Phạm Đức Dũng", ngaysx: "10/05/2022", ngaylap: "25/06/2022", mota: "Điện kế 1 pha", status: "stopped" },
];

export const DKD = {
  "12345678": { makh: "KH0000000000142", tn: "Nguyễn Văn An", ngaysx: "15/01/2021", ngaylap: "05/03/2021", mota: "Điện kế 1 pha" },
  "87654321": { makh: "KH0000000000207", tn: "Trần Thị Bảo", ngaysx: "20/11/2020", ngaylap: "12/01/2021", mota: "Điện kế 3 pha" },
  "11223344": { makh: "KH0000000000315", tn: "Phạm Đức Dũng", ngaysx: "10/05/2022", ngaylap: "25/06/2022", mota: "Điện kế 1 pha" },
};

export const INVOICES = [
  { mahd: "HD2025030142", ky: "03/2025", tn: "Nguyễn Văn An", dk: "12345678", cd: 1542, cc: 1782, dn: 240, tt: 554378, status: "paid" },
  { mahd: "HD2025030207", ky: "03/2025", tn: "Trần Thị Bảo", dk: "87654321", cd: 2015, cc: 2265, dn: 250, tt: 621500, status: "unpaid" },
];

export const LICH_SU_GIA = [
  {
    id: "QĐ-2941",
    ten: "Quyết định 2941/QĐ-BCT",
    ngayApDung: "11/10/2023",
    ngayKetThuc: "Hiện tại",
    trangThai: "active",
    chiTiet: [
      { bac: 1, tu: 0, den: 50, gia: 1806 },
      { bac: 2, tu: 51, den: 100, gia: 1866 },
      { bac: 3, tu: 101, den: 200, gia: 2167 },
      { bac: 4, tu: 201, den: 300, gia: 2729 },
      { bac: 5, tu: 301, den: 400, gia: 3050 },
      { bac: 6, tu: 401, den: null, gia: 3151 },
    ]
  },
  {
    id: "QĐ-648",
    ten: "Quyết định 648/QĐ-BCT",
    ngayApDung: "20/03/2019",
    ngayKetThuc: "10/10/2023",
    trangThai: "inactive",
    chiTiet: [
      { bac: 1, tu: 0, den: 50, gia: 1678 },
      { bac: 2, tu: 51, den: 100, gia: 1734 },
      { bac: 3, tu: 101, den: 200, gia: 2014 },
      { bac: 4, tu: 201, den: 300, gia: 2536 },
      { bac: 5, tu: 301, den: 400, gia: 2834 },
      { bac: 6, tu: 401, den: null, gia: 2927 },
    ]
  }
];
