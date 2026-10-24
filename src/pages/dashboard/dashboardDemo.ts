// ข้อมูลสาธิตเท่านั้น: เปลี่ยนเป็นข้อมูล API เมื่อเชื่อม backend
export const demoCompanies = [
  { id: "company-a", name: "บริษัท A (ตัวอย่าง)" },
  { id: "company-b", name: "บริษัท B (ตัวอย่าง)" },
];
export const camps = [
  { id: "camp-a", name: "แคมป์ A", capacity: 100 },
  { id: "camp-b", name: "แคมป์ B", capacity: 80 },
  { id: "camp-c", name: "แคมป์ C", capacity: 60 },
];
export const demoPeople = Array.from({ length: 245 }, (_, index) => ({
  id: index + 1,
  active: index < 228,
  companyId: index < 140 ? "company-a" : "company-b",
  campId: index % 5 === 0 ? null : camps[index % 3].id,
  health:
    index % 7 === 0 ? "ยังไม่ตรวจ" : index % 5 === 0 ? "ต้องติดตาม" : "ปกติ",
  blood: ["A", "B", "O", "AB"][index % 4],
}));
export const demoIncidents = Array.from({ length: 12 }, (_, index) => ({
  id: `INC-2026-${String(index + 1).padStart(3, "0")}`,
  companyId: index % 2 === 0 ? "company-a" : "company-b",
  date: `2026-${String(5 + (index % 6)).padStart(2, "0")}-${String(index + 1).padStart(2, "0")}`,
  type: ["บาดเจ็บเล็กน้อย", "ทรัพย์สินเสียหาย", "เกือบเกิดอุบัติเหตุ"][
    index % 3
  ],
  severity: index % 4 === 0 ? "ปานกลาง" : "ต่ำ",
  status: index % 3 === 0 ? "อยู่ระหว่างดำเนินการ" : "ปิดแล้ว",
}));
