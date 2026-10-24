import { lazy, Suspense, useEffect, useRef } from "react";
import { ArrowLeft, LayoutGrid, Sparkles } from "lucide-react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import HeroCover from "../../components/HeroCover";
import DashboardCatalog from "./component/DashboardCatalog";
import { dashboardCatalog, findDashboard } from "./dashboardConfig";

const ManpowerDashboard = lazy(() => import("./views/ManpowerDashboard"));
const ResidentialDashboard = lazy(() => import("./views/ResidentialDashboard"));
const HealthDashboard = lazy(() => import("./views/HealthDashboard"));
const AccidentDashboard = lazy(() => import("./views/AccidentDashboard"));

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const selected = findDashboard(searchParams.get("view"));
  const heading = useRef<HTMLHeadingElement>(null);
  const previousView = useRef(selected?.id);
  useEffect(() => {
    if (previousView.current !== selected?.id) {
      if (selected) heading.current?.focus();
      else document.getElementById("dashboard-catalog-heading")?.focus();
      window.scrollTo({ top: 0, behavior: "auto" });
      previousView.current = selected?.id;
    }
  }, [selected?.id]);
  const href = (view?: string) => {
    const next = new URLSearchParams(searchParams);
    if (view) next.set("view", view);
    else next.delete("view");
    const query = next.toString();
    return `${location.pathname}${query ? `?${query}` : ""}`;
  };
  const Icon = selected?.icon ?? LayoutGrid;
  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {selected ? (
        <header
          className="relative overflow-hidden px-4 pb-12 pt-32 sm:px-6 sm:pt-36 lg:px-8"
          style={{
            background: `linear-gradient(130deg, ${selected.dark}, ${selected.darkEnd})`,
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-24 h-96 w-96 rounded-full border-[50px] border-white/5"
          />
          <div className="relative mx-auto max-w-7xl">
            <Link
              to={href()}
              className="mb-6 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ArrowLeft size={17} /> ภาพรวมทั้งหมด
            </Link>
            <div
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]"
              style={{ color: selected.border }}
            >
              <Icon size={18} aria-hidden="true" /> CHK • Dashboard Center
            </div>
            <h1
              ref={heading}
              tabIndex={-1}
              className="mt-4 max-w-4xl text-3xl font-bold leading-tight text-white outline-none sm:text-4xl"
            >
              {selected.title} Dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
              {selected.description}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80">
              <Sparkles size={14} aria-hidden="true" />{" "}
              ข้อมูลตัวอย่างสำหรับออกแบบ • ยังไม่ได้เชื่อม API
            </span>
          </div>
        </header>
      ) : (
        <HeroCover
          size="large"
          image="/training-cover.jpg"
          imagePosition="center"
          eyebrow="CHK • Dashboard Center"
          eyebrowIcon={LayoutGrid}
          title="ภาพรวมการบริหารจัดการ"
          highlight="พนักงานและความปลอดภัย"
          description="สำรวจกำลังคน ที่พัก สุขภาพ และอุบัติเหตุ ผ่านตัวเลขสำคัญในมุมมองเดียว เลือกแต่ละหมวดเพื่อดูรายละเอียด"
        />
      )}
      {selected ? (
        <div className="mx-auto max-w-7xl px-4 pt-7 sm:px-6 lg:px-8">
          <nav
            aria-label="เลือก Dashboard"
            className="mb-7 flex flex-wrap gap-2"
          >
            {dashboardCatalog.map((item) => (
              <Link
                key={item.id}
                to={href(item.id)}
                aria-current={selected.id === item.id ? "page" : undefined}
                className="rounded-full border px-4 py-2 text-sm font-semibold transition hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                style={{
                  backgroundColor:
                    selected.id === item.id ? item.soft : "white",
                  color: selected.id === item.id ? item.color : "#64748b",
                  borderColor:
                    selected.id === item.id ? item.border : "#e2e8f0",
                }}
              >
                {item.subtitle}
              </Link>
            ))}
          </nav>
          <Suspense
            fallback={
              <p
                role="status"
                className="rounded-2xl bg-white p-10 text-center text-slate-500"
              >
                กำลังโหลด Dashboard…
              </p>
            }
          >
            {selected.id === "manpower" ? (
              <ManpowerDashboard />
            ) : selected.id === "residential" ? (
              <ResidentialDashboard />
            ) : selected.id === "health" ? (
              <HealthDashboard />
            ) : (
              <AccidentDashboard />
            )}
          </Suspense>
        </div>
      ) : (
        <DashboardCatalog href={href} />
      )}
    </div>
  );
}
