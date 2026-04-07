import { useState } from "react";
import TabKH  from "./tabs/TabKH";
import TabDK  from "./tabs/TabDK";
import TabTT  from "./tabs/TabTT";
import TabHD  from "./tabs/TabHD";
import TabTra from "./tabs/TabTra";
import TabGia from "./tabs/TabGia";
import TabLichSuGia from "./tabs/TabLichSuGia";

const TABS = [
  { id: "kh",  label: "Quản lý KH",     Component: TabKH },
  { id: "dk",  label: "Quản lý điện kế", Component: TabDK },
  { id: "tt",  label: "Tính tiền điện",  Component: TabTT },
  { id: "hd",  label: "Hóa đơn",         Component: TabHD },
  { id: "tra", label: "Tra cứu",         Component: TabTra },
  { id: "gia", label: "Bảng giá điện",   Component: TabGia },
  { id: "lsgia", label: "Lịch sử giá",     Component: TabLichSuGia },
];

export default function App() {
  const [active, setActive] = useState("kh");
  const ActiveTab = TABS.find((t) => t.id === active)?.Component;

  return (
    <div className="bg-neutral-900 min-h-screen font-sans">
      <div className="flex bg-neutral-900 border-b border-neutral-800 px-3 gap-0.5 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`
              px-3 py-2.5 text-[12px] font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer bg-transparent
              ${active === tab.id
                ? "text-red-500 border-red-500"
                : "text-neutral-400 border-transparent hover:text-neutral-200"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {ActiveTab && <ActiveTab />}
    </div>
  );
}