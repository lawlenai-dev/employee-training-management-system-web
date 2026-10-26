// Initial demo data only. Once saved, edits come from the RBAC store.
export const demoAccounts = [
  {
    id: 1,
    username: "admin",
    password: "1234",
    name: "System Admin",
    role: "admin",
    supplierId: undefined as number | undefined,
  },
  {
    id: 2,
    username: "viewer",
    password: "1234",
    name: "Demo Viewer",
    role: "viewer",
    supplierId: undefined as number | undefined,
  },
  {
    id: 3,
    username: "supplier",
    password: "1234",
    name: "Subcontract A",
    role: "supplier",
    supplierId: 101,
  },
  {
    id: 4,
    username: "trainer",
    password: "1234",
    name: "Demo Trainer",
    role: "trainer",
    supplierId: undefined as number | undefined,
  },
];
export const initialRoleTemplates = [
  {
    id: "admin",
    name: "ผู้ดูแลระบบ",
    permissions: [
      "dashboard.view",
      "courses.view",
      "attendance.view",
      "employees.view_all",
      "employees.view_company",
      "employees.create",
      "employees.qr",
      "preregistration.create",
      "preregistration.view_own",
      "preregistration.review",
      "settings.view",
    ],
  },
  {
    id: "viewer",
    name: "ผู้ดูข้อมูล",
    permissions: [
      "dashboard.view",
      "courses.view",
      "employees.view_all",
      "employees.qr",
    ],
  },
  {
    id: "supplier",
    name: "บริษัทผู้รับเหมา",
    permissions: [
      "employees.view_company",
      "employees.qr",
      "preregistration.create",
      "preregistration.view_own",
      "courses.view",
    ],
  },
  {
    id: "trainer",
    name: "วิทยากร",
    permissions: ["dashboard.view", "courses.view", "attendance.view"],
  },
];
