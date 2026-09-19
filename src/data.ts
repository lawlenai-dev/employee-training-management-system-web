export type ActiveStatus = "active" | "inactive";
export type CourseStatus = "OPEN" | "DRAFT" | "CLOSED" | "CANCELLED";

export type EmployeeDetail = {
  id: number;
  employee_code: string;
  prefix: string;
  first_name: string;
  last_name: string;
  gender: string;
  nationality: string;
  blood_group: string;
  department: string;
  position: string;
  supplier_name: string;
  birth_date: string;
  qr_token: string;
  is_active: number;
  created_at: string;
  updated_at: string;
};
export type CourseMock = {
  id: number;
  title: string;
  description: string;
  course_date: string;
  start_time: string;
  end_time: string;
  location: string;
  instructor: string;
  status: CourseStatus;
  attendance_count?: number;
  created_at: string;
  updated_at: string;
};

export type AttendanceMock = {
  id: number;
  course_id: number;
  employee_id: number;
  checkin_method: "qr" | "manual";
  checked_in_at: string;
};

export type RecentTraining = {
  id: number;
  date: string;
  courseCode: string;
  courseName: string;
  location: string;
  trainer: string;
  attendees: number;
  status: "synced" | "offline";
};

export type PositionMock = {
  id: number;
  code: string;
  name: string;
  description: string;
  status: ActiveStatus;
};

export type CourseTrainingDatum = {
  id: number;
  courseId: number;
  courseCode: string;
  courseName: string;
  category: string;
  employees: number;
  completed: number;
  absent: number;
  percentage: number;
  color: string;
};

export type SupplierMock = {
  id: number;
  supplierNameTH: string;
  supplierNameEN: string;
  address: string;
  status: ActiveStatus;
};

export type UserPermissionMock = {
  id: number;
  name: string;
  username: string;
  department: string;
  role: string;
  status: ActiveStatus;
};

const employeesMockup: EmployeeDetail[] = [
  {
    id: 1,
    employee_code: "EMP001",
    prefix: "นาย",
    first_name: "สมชาย",
    last_name: "ใจดี",
    gender: "ชาย",
    nationality: "ไทย",
    blood_group: "A",
    birth_date: "1995-03-12",
    department: "Production",
    position: "Production Engineer",
    qr_token: "QR_EMP001_A8F32K",
    supplier_name: "",
    is_active: 1,
    created_at: "2026-08-01 08:30:00",
    updated_at: "2026-08-01 08:30:00",
  },

  {
    id: 2,
    employee_code: "EMP002",
    prefix: "นางสาว",
    first_name: "สมหญิง",
    last_name: "รักงาน",
    gender: "หญิง",
    nationality: "ไทย",
    blood_group: "B",
    birth_date: "1998-07-25",
    department: "Quality Control",
    position: "QC Engineer",
    qr_token: "QR_EMP002_B7G21L",
    supplier_name: "",
    is_active: 1,
    created_at: "2026-08-01 08:35:00",
    updated_at: "2026-08-01 08:35:00",
  },

  {
    id: 3,
    employee_code: "EMP003",
    prefix: "นาย",
    first_name: "คำหล้า",
    last_name: "วงสะหวัน",
    gender: "ชาย",
    nationality: "ลาว",
    blood_group: "O",
    birth_date: "1992-11-08",
    department: "Maintenance",
    position: "Maintenance Technician",
    qr_token: "QR_EMP003_C6H54M",
    supplier_name: "",
    is_active: 1,
    created_at: "2026-08-02 09:00:00",
    updated_at: "2026-08-02 09:00:00",
  },

  {
    id: 4,
    employee_code: "EMP004",
    prefix: "นาย",
    first_name: "อนันต์",
    last_name: "มีสุข",
    gender: "ชาย",
    nationality: "ไทย",
    blood_group: "AB",
    birth_date: "2000-01-19",
    department: "Production",
    position: "Operator",
    qr_token: "QR_EMP004_D5J87N",
    supplier_name: "",
    is_active: 1,
    created_at: "2026-08-02 09:15:00",
    updated_at: "2026-08-02 09:15:00",
  },

  {
    id: 5,
    employee_code: "EMP005",
    prefix: "นางสาว",
    first_name: "นภัสสร",
    last_name: "ศรีสุข",
    gender: "หญิง",
    nationality: "ไทย",
    blood_group: "A",
    birth_date: "1997-09-30",
    department: "Human Resources",
    position: "HR Officer",
    qr_token: "QR_EMP005_E4K63P",
    supplier_name: "",
    is_active: 1,
    created_at: "2026-08-03 10:00:00",
    updated_at: "2026-08-03 10:00:00",
  },

  {
    id: 6,
    employee_code: "EMP006",
    prefix: "นาย",
    first_name: "บุญมี",
    last_name: "แก้ววิไล",
    gender: "ชาย",
    nationality: "ลาว",
    blood_group: "B",
    birth_date: "1994-04-16",
    department: "IT",
    position: "IT Support",
    qr_token: "QR_EMP006_F3L92Q",
    supplier_name: "",
    is_active: 1,
    created_at: "2026-08-03 10:20:00",
    updated_at: "2026-08-03 10:20:00",
  },

  {
    id: 7,
    employee_code: "EMP007",
    prefix: "นาง",
    first_name: "ปวีณา",
    last_name: "สุขใจ",
    gender: "หญิง",
    nationality: "ไทย",
    blood_group: "O",
    birth_date: "1990-12-05",
    department: "Accounting",
    position: "Accountant",
    qr_token: "QR_EMP007_G2M45R",
    supplier_name: "",
    is_active: 1,
    created_at: "2026-08-04 08:45:00",
    updated_at: "2026-08-04 08:45:00",
  },

  {
    id: 8,
    employee_code: "EMP008",
    prefix: "นาย",
    first_name: "สมพร",
    last_name: "สีวิไล",
    gender: "ชาย",
    nationality: "ลาว",
    blood_group: "AB",
    birth_date: "1988-06-21",
    department: "Warehouse",
    position: "Warehouse Supervisor",
    qr_token: "QR_EMP008_H1N78S",
    supplier_name: "",
    is_active: 1,
    created_at: "2026-08-04 09:30:00",
    updated_at: "2026-08-04 09:30:00",
  },

  {
    id: 9,
    employee_code: "EMP009",
    prefix: "นางสาว",
    first_name: "ชลธิชา",
    last_name: "แก้วใส",
    gender: "หญิง",
    nationality: "ไทย",
    blood_group: "B",
    birth_date: "2002-02-14",
    department: "Quality Control",
    position: "QC Inspector",
    qr_token: "QR_EMP009_J9P34T",
    supplier_name: "",
    is_active: 1,
    created_at: "2026-08-05 08:00:00",
    updated_at: "2026-08-05 08:00:00",
  },

  {
    id: 10,
    employee_code: "EMP010",
    prefix: "นาย",
    first_name: "ณัฐวุฒิ",
    last_name: "เก่งงาน",
    gender: "ชาย",
    nationality: "ไทย",
    blood_group: "O",
    birth_date: "1985-08-11",
    department: "Production",
    position: "Production Supervisor",
    qr_token: "QR_EMP010_K8Q56U",
    supplier_name: "",
    is_active: 0,
    created_at: "2026-08-05 08:30:00",
    updated_at: "2026-08-10 14:20:00",
  },
];

const coursesMockup: CourseMock[] = [
  {
    id: 1,
    title: "ความปลอดภัยในการทำงาน",
    description: "อบรมความรู้พื้นฐานเกี่ยวกับความปลอดภัยในการทำงาน",
    course_date: "2026-09-01",
    start_time: "09:00:00",
    end_time: "12:00:00",
    location: "Training Room 1",
    instructor: "สมชาย วิทยากร",
    status: "OPEN",
    created_at: "2026-08-20 09:00:00",
    updated_at: "2026-08-20 09:00:00",
  },
  {
    id: 2,
    title: "5S ในสถานประกอบการ",
    description: "หลักการ 5S และการนำไปใช้ในพื้นที่ปฏิบัติงาน",
    course_date: "2026-09-03",
    start_time: "13:00:00",
    end_time: "16:00:00",
    location: "Training Room 2",
    instructor: "กิตติ พัฒนาการ",
    status: "OPEN",
    created_at: "2026-08-20 10:00:00",
    updated_at: "2026-08-20 10:00:00",
  },
  {
    id: 3,
    title: "การควบคุมคุณภาพ",
    description: "พื้นฐานการตรวจสอบและควบคุมคุณภาพในกระบวนการผลิต",
    course_date: "2026-09-05",
    start_time: "09:00:00",
    end_time: "16:00:00",
    location: "Quality Training Room",
    instructor: "สมหญิง รักงาน",
    status: "OPEN",
    created_at: "2026-08-21 09:00:00",
    updated_at: "2026-08-21 09:00:00",
  },
  {
    id: 4,
    title: "การบำรุงรักษาเครื่องจักร",
    description: "ความรู้เบื้องต้นเกี่ยวกับ Preventive Maintenance",
    course_date: "2026-09-08",
    start_time: "09:00:00",
    end_time: "12:00:00",
    location: "Maintenance Room",
    instructor: "ธนกร วงศ์ดี",
    status: "OPEN",
    created_at: "2026-08-22 09:00:00",
    updated_at: "2026-08-22 09:00:00",
  },
  {
    id: 5,
    title: "Leadership & Teamwork",
    description: "พัฒนาทักษะการเป็นผู้นำและการทำงานเป็นทีม",
    course_date: "2026-08-15",
    start_time: "09:00:00",
    end_time: "16:00:00",
    location: "Meeting Hall",
    instructor: "ผู้เชี่ยวชาญด้าน HR",
    status: "CLOSED",
    created_at: "2026-07-20 09:00:00",
    updated_at: "2026-08-16 16:00:00",
  },
];

const attendancesMockup: AttendanceMock[] = [
  {
    id: 1,
    course_id: 1,
    employee_id: 1,
    checkin_method: "qr",
    checked_in_at: "2026-09-01 08:52:10",
  },
  {
    id: 2,
    course_id: 1,
    employee_id: 2,
    checkin_method: "qr",
    checked_in_at: "2026-09-01 08:55:32",
  },
  {
    id: 3,
    course_id: 1,
    employee_id: 3,
    checkin_method: "manual",
    checked_in_at: "2026-09-01 08:58:45",
  },
  {
    id: 4,
    course_id: 1,
    employee_id: 4,
    checkin_method: "qr",
    checked_in_at: "2026-09-01 08:59:12",
  },
  {
    id: 5,
    course_id: 2,
    employee_id: 1,
    checkin_method: "qr",
    checked_in_at: "2026-09-03 12:52:10",
  },
  {
    id: 6,
    course_id: 2,
    employee_id: 5,
    checkin_method: "manual",
    checked_in_at: "2026-09-03 12:55:20",
  },
  {
    id: 7,
    course_id: 2,
    employee_id: 6,
    checkin_method: "qr",
    checked_in_at: "2026-09-03 12:57:40",
  },
  {
    id: 8,
    course_id: 3,
    employee_id: 2,
    checkin_method: "qr",
    checked_in_at: "2026-09-05 08:50:15",
  },
  {
    id: 9,
    course_id: 3,
    employee_id: 7,
    checkin_method: "qr",
    checked_in_at: "2026-09-05 08:53:22",
  },
  {
    id: 10,
    course_id: 3,
    employee_id: 9,
    checkin_method: "manual",
    checked_in_at: "2026-09-05 08:57:31",
  },
];

const recentTrainings: RecentTraining[] = [
  {
    id: 1,
    date: "08 ส.ค. 2026",
    courseCode: "CS1",
    courseName: "การยกและผูกรัด",
    location: "ศูนย์อบรม A · โซน 3",
    trainer: "พี่จุดม",
    attendees: 24,
    status: "synced",
  },
  {
    id: 2,
    date: "08 ส.ค. 2026",
    courseCode: "CR1",
    courseName: "ปฐมนิเทศความปลอดภัย",
    location: "สำนักงานใหญ่",
    trainer: "พี่แกรม",
    attendees: 51,
    status: "synced",
  },
  {
    id: 3,
    date: "07 ส.ค. 2026",
    courseCode: "ST2",
    courseName: "งานความร้อน / งานเชื่อม",
    location: "โรงไฟฟ้า",
    trainer: "พี่เซียน",
    attendees: 18,
    status: "synced",
  },
  {
    id: 4,
    date: "07 ส.ค. 2026",
    courseCode: "CS5",
    courseName: "ปฐมพยาบาล & CPR",
    location: "หน่วยพยาบาล",
    trainer: "พี่โชติรส",
    attendees: 12,
    status: "offline",
  },
  {
    id: 5,
    date: "06 ส.ค. 2026",
    courseCode: "CS2",
    courseName: "นั่งร้าน & ผู้ควบคุม",
    location: "กำแพงกันน้ำ",
    trainer: "พี่เล็ก",
    attendees: 30,
    status: "synced",
  },
];

const positionMockup: PositionMock[] = [
  {
    id: 1,
    code: "PM",
    name: "Project Manager",
    description: "ผู้จัดการโครงการ",
    status: "active",
  },
  {
    id: 2,
    code: "DPM",
    name: "Deputy Project Manager",
    description: "รองผู้จัดการโครงการ",
    status: "active",
  },
  {
    id: 3,
    code: "SM",
    name: "Section Manager",
    description: "ผู้จัดการส่วนงาน",
    status: "active",
  },
  {
    id: 4,
    code: "HSE",
    name: "Health, Safety and Environmental",
    description: "เจ้าหน้าที่อาชีวอนามัย ความปลอดภัย และสิ่งแวดล้อม",
    status: "active",
  },
  {
    id: 5,
    code: "ENG",
    name: "Engineer / Architect / Geologist / Specialist",
    description: "วิศวกร / สถาปนิก / นักธรณีวิทยา / ผู้เชี่ยวชาญ",
    status: "active",
  },
  {
    id: 6,
    code: "ADMIN",
    name: "Admin / Secretary / Officer",
    description: "ธุรการ / เลขานุการ / เจ้าหน้าที่",
    status: "active",
  },
  {
    id: 7,
    code: "SUP",
    name: "Supervisor / Foreman / Mechanic / Technician",
    description: "หัวหน้างาน / โฟร์แมน / ช่างเครื่อง / ช่างเทคนิค",
    status: "active",
  },
  {
    id: 8,
    code: "QAQC",
    name: "Surveyor / Inspector / QA / QC",
    description: "ช่างสำรวจ / ผู้ตรวจสอบ / ประกันคุณภาพ / ควบคุมคุณภาพ",
    status: "active",
  },
  {
    id: 9,
    code: "SKW",
    name: "Skilled Worker / Asst. Surveyor / Draftman",
    description: "ช่างฝีมือ / ผู้ช่วยช่างสำรวจ / ช่างเขียนแบบ",
    status: "active",
  },
  {
    id: 10,
    code: "HEO",
    name: "Heavy Equipment Operator",
    description: "พนักงานขับเครื่องจักรหนัก",
    status: "active",
  },
  {
    id: 11,
    code: "WEL",
    name: "Welder",
    description: "ช่างเชื่อม",
    status: "active",
  },
  {
    id: 12,
    code: "LAB",
    name: "Worker / Labour",
    description: "คนงาน / แรงงาน",
    status: "active",
  },
  {
    id: 13,
    code: "DRV",
    name: "Driver",
    description: "พนักงานขับรถ",
    status: "active",
  },
  {
    id: 14,
    code: "HK",
    name: "Housekeeper / Maid",
    description: "พนักงานดูแลความสะอาด / แม่บ้าน",
    status: "active",
  },
  {
    id: 15,
    code: "ITM",
    name: "IT Manager",
    description: "ผู้จัดการฝ่ายเทคโนโลยีสารสนเทศ",
    status: "active",
  },
  {
    id: 16,
    code: "ITSA",
    name: "IT System Admin",
    description: "ผู้ดูแลระบบเทคโนโลยีสารสนเทศ",
    status: "active",
  },
];

const courseTrainingData: CourseTrainingDatum[] = [
  {
    id: 1,
    courseId: 1,
    courseCode: "CS1",
    courseName: "ความปลอดภัยในการทำงาน",
    category: "Safety",
    employees: 42,
    completed: 38,
    absent: 4,
    percentage: 31.8,
    color: "#003274",
  },
  {
    id: 2,
    courseId: 2,
    courseCode: "5S",
    courseName: "5S ในสถานประกอบการ",
    category: "General",
    employees: 31,
    completed: 29,
    absent: 2,
    percentage: 23.5,
    color: "#1769ad",
  },
  {
    id: 3,
    courseId: 3,
    courseCode: "QC1",
    courseName: "การตรวจสอบและควบคุมคุณภาพ",
    category: "Quality",
    employees: 24,
    completed: 22,
    absent: 2,
    percentage: 18.2,
    color: "#4d91d2",
  },
  {
    id: 4,
    courseId: 4,
    courseCode: "PM1",
    courseName: "การบำรุงรักษาเครื่องจักร",
    category: "Technical",
    employees: 19,
    completed: 17,
    absent: 2,
    percentage: 14.4,
    color: "#f59e0b",
  },
  {
    id: 5,
    courseId: 5,
    courseCode: "LD1",
    courseName: "Leadership & Teamwork",
    category: "Management",
    employees: 16,
    completed: 15,
    absent: 1,
    percentage: 12.1,
    color: "#87b8e4",
  },
];

const supplierMockup: SupplierMock[] = [
  {
    id: 1,
    supplierNameTH: "บริษัท ลอว์เลนส์ เทค จำกัด",
    supplierNameEN: "LAWLENS TECH Co., Ltd.",
    address:
      "25 อาคารอัลม่า ลิงค์ ห้องเลขที่ 647 ชั้นที่ 17 ซอย ชิดลม ถนนเพลินจิต แขวงปทุมวัน เขตปทุมวัน กรุงเทพมหานคร 10330",
    status: "active",
  },
];

const userPermissionMockup: UserPermissionMock[] = [
  {
    id: 1,
    name: "สมชาย ใจดี",
    username: "somchai",
    department: "Safety",
    role: "Admin",
    status: "active",
  },
  {
    id: 2,
    name: "วราภรณ์ มั่นคง",
    username: "waraporn",
    department: "Human Resource",
    role: "Viewer",
    status: "active",
  },
  {
    id: 3,
    name: "ประเสริฐ ทำงานดี",
    username: "prasert",
    department: "Production",
    role: "Trainer",
    status: "active",
  },
  {
    id: 4,
    name: "Supplier A",
    username: "kittichai",
    department: "Contractor",
    role: "Supplier",
    status: "inactive",
  },
];

const roleOptions = [
  { label: "Admin", value: "Admin" },
  { label: "Viewer", value: "Viewer" },
  { label: "Supplier", value: "Supplier" },
  { label: "Trainer", value: "Trainer" },
];

export {
  employeesMockup,
  coursesMockup,
  attendancesMockup,
  recentTrainings,
  positionMockup,
  courseTrainingData,
  supplierMockup,
  userPermissionMockup,
  roleOptions,
};
