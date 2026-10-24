import type { PersonalData } from "./personalSettings.types";
export const initialPersonalData: PersonalData = {
  nationalities: [
    {
      id: 1,
      code: "TH",
      nameTh: "ไทย",
      nameEn: "Thai",
      status: "active",
    },
    {
      id: 2,
      code: "MM",
      nameTh: "เมียนมา",
      nameEn: "Myanmar",
      status: "active",
    },
    {
      id: 3,
      code: "KH",
      nameTh: "กัมพูชา",
      nameEn: "Cambodian",
      status: "active",
    },
  ],

  bloodTypes: [
    {
      id: 1,
      code: "A",
      nameTh: "กรุ๊ปเลือด A",
      nameEn: "Blood Type A",
      status: "active",
    },
    {
      id: 2,
      code: "B",
      nameTh: "กรุ๊ปเลือด B",
      nameEn: "Blood Type B",
      status: "active",
    },
    {
      id: 3,
      code: "AB",
      nameTh: "กรุ๊ปเลือด AB",
      nameEn: "Blood Type AB",
      status: "active",
    },
    {
      id: 4,
      code: "O",
      nameTh: "กรุ๊ปเลือด O",
      nameEn: "Blood Type O",
      status: "active",
    },
  ],

  genders: [
    {
      id: 1,
      code: "M",
      nameTh: "ชาย",
      nameEn: "Male",
      status: "active",
    },
    {
      id: 2,
      code: "F",
      nameTh: "หญิง",
      nameEn: "Female",
      status: "active",
    },
    {
      id: 3,
      code: "O",
      nameTh: "อื่น ๆ",
      nameEn: "Other",
      status: "active",
    },
  ],

  prefixes: [
    {
      id: 1,
      code: "MR",
      nameTh: "นาย",
      nameEn: "Mr.",
      status: "active",
    },
    {
      id: 2,
      code: "MRS",
      nameTh: "นาง",
      nameEn: "Mrs.",
      status: "active",
    },
    {
      id: 3,
      code: "MS",
      nameTh: "นางสาว",
      nameEn: "Ms.",
      status: "active",
    },
  ],
};
