import { Building2, HeartPulse, ShieldAlert, UsersRound } from "lucide-react";

export const dashboardCatalog = [
  {
    id: "manpower",
    title: "Manpower / Demographic",
    subtitle: "กำลังคนและข้อมูลประชากร",
    description: "เข้าใจโครงสร้างพนักงาน สัดส่วนประชากร และความครอบคลุมการอบรม",
    icon: UsersRound,
    color: "#2563eb",
    dark: "#001a3d",
    darkEnd: "#174a8b",
    soft: "#eff6ff",
    border: "#bfdbfe",
  },
  {
    id: "residential",
    title: "Residential",
    subtitle: "ที่พักและการอยู่อาศัย",
    description:
      "สำรวจการเข้าพัก ความจุคงเหลือ และภาพรวมผู้พักอาศัยในแต่ละแคมป์",
    icon: Building2,
    color: "#7c3aed",
    dark: "#25104f",
    darkEnd: "#633395",
    soft: "#f5f3ff",
    border: "#ddd6fe",
  },
  {
    id: "health",
    title: "Health",
    subtitle: "สุขภาพพนักงาน",
    description:
      "ติดตามผลตรวจสุขภาพ สถานะการตรวจ และรายการที่ต้องติดตามเพิ่มเติม",
    icon: HeartPulse,
    color: "#059669",
    dark: "#023c32",
    darkEnd: "#11735a",
    soft: "#ecfdf5",
    border: "#a7f3d0",
  },
  {
    id: "accident",
    title: "Accident",
    subtitle: "อุบัติเหตุและเหตุการณ์ผิดปกติ",
    description:
      "ติดตามจำนวนเหตุการณ์ ความรุนแรง และความคืบหน้าการแก้ไขป้องกัน",
    icon: ShieldAlert,
    color: "#ea580c",
    dark: "#542008",
    darkEnd: "#a74716",
    soft: "#fff7ed",
    border: "#fed7aa",
  },
] as const;
export type DashboardId = (typeof dashboardCatalog)[number]["id"];
export type DashboardDefinition = (typeof dashboardCatalog)[number];
export const findDashboard = (value: string | null) =>
  dashboardCatalog.find((item) => item.id === value);
