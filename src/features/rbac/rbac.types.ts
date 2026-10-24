export const permissionGroups = [
  {
    label: "แดชบอร์ด",
    items: [
      {
        key: "dashboard.view",
        label: "ดูแดชบอร์ด",
      },
    ],
  },
  {
    label: "หลักสูตรและเช็คชื่อ",
    items: [
      {
        key: "courses.view",
        label: "ดูหลักสูตร",
      },
      {
        key: "attendance.view",
        label: "เข้าหน้าเช็คชื่อ",
      },
    ],
  },
  {
    label: "พนักงาน",
    items: [
      {
        key: "employees.view_all",
        label: "ดูพนักงานทุกบริษัท",
      },
      {
        key: "employees.view_company",
        label: "ดูพนักงานบริษัทตนเอง",
      },
      {
        key: "employees.create",
        label: "เพิ่มพนักงาน",
      },
      {
        key: "employees.qr",
        label: "ดู QR พนักงาน",
      },
    ],
  },
  {
    label: "คำขอลงทะเบียน",
    items: [
      {
        key: "preregistration.create",
        label: "สร้างคำขอลงทะเบียน",
      },
      {
        key: "preregistration.view_own",
        label: "ดูคำขอของตนเอง",
      },
      {
        key: "preregistration.review",
        label: "ตรวจสอบและอนุมัติคำขอ",
      },
    ],
  },
  {
    label: "ตั้งค่า",
    items: [
      {
        key: "settings.view",
        label: "เข้าหน้าตั้งค่าและจัดการสิทธิ์",
      },
    ],
  },
] as const;
export type Permission =
  (typeof permissionGroups)[number]["items"][number]["key"];
export const permissionKeys: readonly string[] = permissionGroups.flatMap(
  (group) => group.items.map((item) => item.key),
);
export type AccessRole = {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  permissions: string[];
};
export type AccessUser = {
  id: string;
  accountId: number;
  password: string;
  supplierId?: number;
  name: string;
  username: string;
  department: string;
  status: "active" | "inactive";
  roleIds: string[];
  supplierTier: string;
};
export type AccessState = {
  version: 1;
  nextAccountId: number;
  roles: AccessRole[];
  users: AccessUser[];
};
