import { ArrowDown, LayoutGrid, Sparkles } from "lucide-react";

export default function DashboardHeroCover() {
  const explore = () => {
    const target = document.getElementById("dashboard-catalog-heading");
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
    target?.focus({ preventScroll: true });
  };
  return (
    <header
      className="relative isolate overflow-hidden px-4 pb-28 pt-10 sm:px-6 sm:pb-32 sm:pt-12 lg:px-8"
      style={{
        backgroundColor: "#f8fafc",
        backgroundImage:
          "radial-gradient(ellipse at 95% 4%, rgba(225,242,240,.82) 0%, transparent 46%), linear-gradient(160deg, #022f3b 0%, #075466 33%, #367e8a 53%, #b8d3d5 77%, #f8fafc 100%)",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,.8) .7px, transparent .7px)",
          backgroundSize: "4px 4px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-50 to-transparent"
      />
      <div className="relative mx-auto max-w-7xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold tracking-[0.12em] text-white backdrop-blur-sm">
          <LayoutGrid size={14} aria-hidden="true" /> CHK • DASHBOARD CENTER
        </span>
        <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
              ภาพรวมที่ชัดเจน
              <br className="hidden sm:block" /> เพื่อดูแลพนักงานได้รอบด้าน
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/80">
              ติดตามกำลังคน ที่พัก สุขภาพ และความปลอดภัย
              <br className="hidden sm:block" /> ผ่านตัวเลขสำคัญ
              พร้อมเปิดดูรายละเอียดในแต่ละด้าน
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
            <button
              type="button"
              onClick={explore}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/80 bg-white px-5 py-3 text-sm font-semibold text-[#075466] shadow-sm transition hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#075466]"
            >
              สำรวจ Dashboard <ArrowDown size={16} aria-hidden="true" />
            </button>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#023643]/75 px-3 py-1.5 text-[11px] text-white/90">
              <Sparkles size={12} aria-hidden="true" /> ข้อมูลตัวอย่าง •
              ยังไม่ได้เชื่อม API
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
