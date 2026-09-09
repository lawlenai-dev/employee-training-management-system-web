const settingsConfig = {
  users: {
    title: "User & Permission",
    thaiTitle: "ผู้ใช้งานและสิทธิ์",
    description: "จัดการบัญชีผู้ใช้งานและสิทธิ์เข้าถึงระบบ",
    addLabel: "เพิ่มผู้ใช้งาน",
    icon: UsersRound,
    columns: [
      { accessor: "name", header: "ชื่อผู้ใช้งาน" },
      { accessor: "username", header: "Username" },
      { accessor: "role", header: "สิทธิ์" },
      { accessor: "status", header: "สถานะ" },
    ],
  },

  categories: {
    title: "Category",
    thaiTitle: "หมวดหมู่หลักสูตร",
    description: "จัดการหมวดหมู่สำหรับจัดกลุ่มหลักสูตร",
    addLabel: "เพิ่มหมวดหมู่",
    icon: Tags,
    columns: [
      { accessor: "code", header: "รหัส" },
      { accessor: "name", header: "ชื่อหมวดหมู่" },
      { accessor: "status", header: "สถานะ" },
    ],
  },

  types: {
    title: "Course Type",
    thaiTitle: "ประเภทหลักสูตร",
    description: "จัดการประเภทและรูปแบบการอบรม",
    addLabel: "เพิ่มประเภท",
    icon: Shapes,
    columns: [
      { accessor: "code", header: "รหัส" },
      { accessor: "name", header: "ชื่อประเภท" },
      { accessor: "status", header: "สถานะ" },
    ],
  },

  namePrefixes: {
    title: "Name Prefix",
    thaiTitle: "คำนำหน้าชื่อ",
    description: "กำหนดคำนำหน้าชื่อที่ใช้ในข้อมูลพนักงาน",
    addLabel: "เพิ่มคำนำหน้าชื่อ",
    icon: UserRound,
    columns: [
      { accessor: "code", header: "รหัส" },
      { accessor: "nameTh", header: "ชื่อภาษาไทย" },
      { accessor: "nameEn", header: "ชื่อภาษาอังกฤษ" },
      { accessor: "status", header: "สถานะ" },
    ],
  },

  genders: {
    title: "Gender",
    thaiTitle: "เพศ",
    description: "กำหนดตัวเลือกเพศสำหรับข้อมูลพนักงาน",
    addLabel: "เพิ่มเพศ",
    icon: VenusAndMars,
    columns: [
      { accessor: "code", header: "รหัส" },
      { accessor: "nameTh", header: "ชื่อภาษาไทย" },
      { accessor: "nameEn", header: "ชื่อภาษาอังกฤษ" },
      { accessor: "status", header: "สถานะ" },
    ],
  },

  nationalities: {
    title: "Nationality",
    thaiTitle: "สัญชาติ",
    description: "กำหนดรายการสัญชาติของพนักงาน",
    addLabel: "เพิ่มสัญชาติ",
    icon: Globe2,
    columns: [
      { accessor: "code", header: "รหัส" },
      { accessor: "nameTh", header: "ชื่อภาษาไทย" },
      { accessor: "nameEn", header: "ชื่อภาษาอังกฤษ" },
      { accessor: "status", header: "สถานะ" },
    ],
  },

  bloodTypes: {
    title: "Blood Type",
    thaiTitle: "หมู่เลือด",
    description: "กำหนดตัวเลือกหมู่เลือดของพนักงาน",
    addLabel: "เพิ่มหมู่เลือด",
    icon: Droplets,
    columns: [
      { accessor: "code", header: "รหัส" },
      { accessor: "name", header: "หมู่เลือด" },
      { accessor: "status", header: "สถานะ" },
    ],
  },
};
 const settingGroups = [
  {
    key: "system",
    title: "การใช้งานระบบ",
    items: ["users"],
  },
  {
    key: "course",
    title: "ข้อมูลหลักสูตร",
    items: ["categories", "types"],
  },
  {
    key: "employee",
    title: "ข้อมูลพื้นฐานพนักงาน",
    items: ["namePrefixes", "genders", "nationalities", "bloodTypes"],
  },
];

export {
    settingsConfig,
    settingGroups
}