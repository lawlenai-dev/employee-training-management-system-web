import {
  BookOpenCheck,
  Building2,
  ClipboardCheck,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";
import {
  getSettingsSection,
  settingsSections,
} from "../../config/settingsSections";
import type { LucideIcon } from "lucide-react";
import type { Permission } from "../../auth/AuthContext";
export type NavigationLink = {
  to: string;
  label: string;
  icon: LucideIcon;
  permissions: Permission[];
};

export type NavigationGroup = {
  label: string;
  icon?: LucideIcon;
  children: NavigationLink[];
};

export type NavigationItem = NavigationLink | NavigationGroup;

const links: NavigationLink[] = [
  {
    to: "/dashboard",
    label: "ภาพรวม",
    icon: LayoutDashboard,
    permissions: ["dashboard.view"],
  },
  {
    to: "/courses",
    label: "หลักสูตร",
    icon: BookOpenCheck,
    permissions: ["courses.view"],
  },
  {
    to: "/employees",
    label: "ข้อมูลพนักงาน",
    icon: Users,
    permissions: ["employees.view_all", "employees.view_company"],
  },
  {
    to: "/pre-registrations",
    label: "Pre-register",
    icon: ClipboardCheck,
    permissions: ["preregistration.view_own", "preregistration.review"],
  },
  {
    to: "/settings",
    label: "ตั้งค่า",
    icon: Settings,
    permissions: ["settings.view"],
  },
];

const reportLinks: NavigationLink[] = [
  {
    to: "/reports/accidents",
    label: "รายการอุบัติเหตุ/เหตุการณ์ผิดปกติ",
    icon: ClipboardCheck,
    permissions: ["preregistration.view_own", "preregistration.review"],
  },
  {
    to: "/reports/warnings",
    label: "หนังสือตักเตือน",
    icon: ClipboardCheck,
    permissions: ["preregistration.view_own", "preregistration.review"],
  },
  {
    to: "/reports/surveillance",
    label: "รายการสุ่มตรวจเฝ้าระวัง",
    icon: ClipboardCheck,
    permissions: ["preregistration.view_own", "preregistration.review"],
  },
];

export const navigationConfig: NavigationItem[] = [
  ...links.filter((link) => link.to !== "/settings"),
  { label: "รายงาน", children: reportLinks },
  {
    label: "ตั้งค่า",
    icon: Settings,
    children: settingsSections.map((section) => ({
      to: `/settings?section=${section.id}`,
      label: section.label,
      icon:
        section.id === "organization"
          ? Building2
          : section.id === "training"
            ? BookOpenCheck
            : Settings,
      permissions: ["settings.view"],
    })),
  },
];
export function isNavigationActive(pathname: string, to: string, search = "") {
  const [targetPath, targetSearch] = to.split("?");
  if (!(
    pathname === targetPath ||
    (targetPath !== "/" && pathname.startsWith(`${targetPath}/`))
  ))
    return false;
  if (!targetSearch) return true;
  const currentParams = new URLSearchParams(search);
  return [...new URLSearchParams(targetSearch)].every(([key, value]) => {
    const current =
      key === "section" && targetPath === "/settings"
        ? getSettingsSection(currentParams.get(key)).id
        : currentParams.get(key);
    return current === value;
  });
}
