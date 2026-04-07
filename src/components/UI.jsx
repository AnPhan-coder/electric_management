export function Panel({ title, extra, children }) {
  return (
    <div className="bg-neutral-800 border border-neutral-800 rounded-xl overflow-hidden mb-3">
      <div className="px-3.5 py-2.5 border-b border-neutral-700 bg-neutral-800/50 flex items-center justify-between">
        <span className="text-[13px] font-medium text-white">{title}</span>
        {extra && <span className="text-[11px] text-neutral-500">{extra}</span>}
      </div>
      <div className="p-3.5">{children}</div>
    </div>
  );
}

export function PanelRaw({ title, extra, children }) {
  return (
    <div className="bg-neutral-800 border border-neutral-800 rounded-xl overflow-hidden mb-3">
      <div className="px-3.5 py-2.5 border-b border-neutral-700 bg-neutral-800/50 flex items-center justify-between">
        <span className="text-[13px] font-medium text-white">{title}</span>
        {extra && <span className="text-[11px] text-neutral-500">{extra}</span>}
      </div>
      {children}
    </div>
  );
}

export function Field({ label, hint, required, children }) {
  return (
    <div className="mb-2">
      {label && (
        <label className="block text-[11px] text-neutral-400 font-medium mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {children}
      {hint && <div className="text-[10px] text-neutral-500 mt-0.5">{hint}</div>}
    </div>
  );
}

export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full text-[12px] px-2.5 py-1.5 border border-neutral-700 rounded-lg bg-neutral-900 text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500 ${className}`}
      {...props}
    />
  );
}

export function Select({ className = "", children, ...props }) {
  return (
    <select
      className={`w-full text-[12px] px-2.5 py-1.5 border border-neutral-700 rounded-lg bg-neutral-900 text-white focus:outline-none focus:border-red-500 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function Btn({ variant = "default", size = "md", className = "", children, ...props }) {
  const base = "rounded-lg font-medium cursor-pointer border transition-colors";
  const sizes = {
    md: "px-3 py-1.5 text-[12px]",
    sm: "px-2 py-0.5 text-[11px]",
  };
  const variants = {
    default:  "bg-neutral-700 hover:bg-neutral-600 text-white border-neutral-700",
    primary:  "bg-red-600 hover:bg-red-700 text-white border-red-600",
    danger:   "bg-red-900/40 text-red-400 border-red-900",
    success:  "bg-green-900/40 text-green-400 border-green-900",
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Pill({ status }) {
  const map = {
    paid:     { label: "Đã TT",     cls: "bg-green-900/40 text-green-400" },
    active:   { label: "Còn dùng",  cls: "bg-green-900/40 text-green-400" },
    unpaid:   { label: "Chưa TT",   cls: "bg-yellow-900/40 text-yellow-400" },
    upcoming: { label: "Sắp đến",   cls: "bg-yellow-900/40 text-yellow-400" },
    overdue:  { label: "Quá hạn",   cls: "bg-red-900/40 text-red-400" },
    inactive: { label: "Ngừng dùng",cls: "bg-neutral-700 text-neutral-400" },
    using:    { label: "Còn sử dụng",cls:"bg-green-900/40 text-green-400" },
    stopped:  { label: "Ngừng sử dụng",cls:"bg-neutral-700 text-neutral-400" },
  };
  const s = map[status] || { label: status, cls: "bg-neutral-700 text-neutral-400" };
  return (
    <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full ${s.cls}`}>
      {s.label}
    </span>
  );
}

export function Alert({ variant = "info", children }) {
  const styles = {
    warning: "bg-yellow-900/30 text-yellow-300 border border-yellow-800/50",
    info:    "bg-blue-900/30 text-blue-300 border border-blue-800/50",
  };
  return (
    <div className={`rounded-lg px-3 py-2 text-[12px] mb-2.5 ${styles[variant]}`}>
      {children}
    </div>
  );
}

export function Row({ children, className = "" }) {
  return <div className={`flex gap-2.5 flex-wrap ${className}`}>{children}</div>;
}

export function Col({ flex = 1, min = 120, children }) {
  return <div style={{ flex, minWidth: min }}>{children}</div>;
}

export function BtnRow({ children }) {
  return <div className="flex gap-1.5 flex-wrap mt-2">{children}</div>;
}

export function Th({ children }) {
  return (
    <th className="px-2.5 py-1.5 text-left text-[10px] font-medium text-neutral-500 border-b border-neutral-700 bg-neutral-800/70 uppercase tracking-wide">
      {children}
    </th>
  );
}

export function Td({ className = "", children }) {
  return (
    <td className={`px-2.5 py-2 text-white border-b border-neutral-800 align-middle ${className}`}>
      {children}
    </td>
  );
}