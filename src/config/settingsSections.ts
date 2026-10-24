import type { SettingMenuKey } from "../pages/settings/settings.types";

export type SettingsSectionId = "general" | "organization" | "training";
export type SettingsPageMenu = SettingMenuKey | "personal";
export type SettingsSection = {
  id: SettingsSectionId;
  label: string;
  description: string;
  menus: readonly SettingsPageMenu[];
};
export const settingsSections: readonly SettingsSection[] = [
  {
    id: "general",
    label: "การตั้งค่าทั่วไป",
    description: "จัดการผู้ใช้งาน บทบาท สิทธิ์ และข้อมูลส่วนบุคคล",
    menus: ["users", "roles", "personal"],
  },
  {
    id: "organization",
    label: "การตั้งค่าสังกัด",
    description: "จัดการบริษัทและตำแหน่งงาน",
    menus: [
      "positions",
      "companies",
      "department",
      "sections",
      // "subsections",
      "camps",
      "subcontractors",
    ],
  },
  {
    id: "training",
    label: "การตั้งค่าการอบรม",
    description: "จัดการหมวดหมู่และประเภทหลักสูตร",
    menus: ["categories", "types"],
  },
];
export function getSettingsSection(
  id: string | null | undefined,
): SettingsSection {
  return (
    settingsSections.find((section) => section.id === id) ??
    settingsSections[0]!
  );
}
