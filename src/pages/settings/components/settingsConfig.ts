import { Shapes, Tags, UsersRound } from "lucide-react";
import * as Yup from "yup";
import {
  positionMockup,
  supplierMockup,
  userPermissionMockup,
} from "../../../data";
import type {
  SettingDefinition,
  SettingFormField,
  SettingMenuKey,
  SettingRow,
} from "../settings.types";

const STATUS_FIELD: SettingFormField = {
  key: "status",
  label: "สถานะ",
  type: "select",
  required: true,
  defaultValue: "active",
  options: [
    { label: "ใช้งาน", value: "active" },
    { label: "ปิดใช้งาน", value: "inactive" },
  ],
};

const DESCRIPTION_FIELD: SettingFormField = {
  key: "description",
  label: "รายละเอียด",
  type: "textarea",
  maxLength: 500,
  fullWidth: true,
  placeholder: "กรอกรายละเอียด",
};

const statusValidation = Yup.string()
  .oneOf(["active", "inactive"], "กรุณาเลือกสถานะ")
  .required("กรุณาเลือกสถานะ");

const codeValidation = Yup.string()
  .trim()
  .min(2, "รหัสต้องมีอย่างน้อย 2 ตัวอักษร")
  .max(30, "รหัสต้องไม่เกิน 30 ตัวอักษร")
  .matches(/^[A-Za-z0-9_-]+$/, "รหัสใช้ได้เฉพาะภาษาอังกฤษ ตัวเลข - และ _")
  .required("กรุณากรอกรหัส");

export const settingsConfig: Record<SettingMenuKey, SettingDefinition> = {
  users: {
    title: "User & Permission",
    thaiTitle: "ผู้ใช้งานและสิทธิ์",
    description: "จัดการบัญชีผู้ใช้งาน บทบาท และสิทธิ์ในการเข้าถึงระบบ",
    addLabel: "เพิ่มผู้ใช้งาน",
    icon: UsersRound,
    columns: [
      { key: "name", label: "ชื่อผู้ใช้งาน" },
      { key: "username", label: "Username" },
      { key: "department", label: "แผนก" },
      { key: "role", label: "สิทธิ์" },
      { key: "status", label: "สถานะ" },
    ],
    formFields: [
      { key: "name", label: "ชื่อผู้ใช้งาน", type: "text", required: true, maxLength: 100, placeholder: "กรอกชื่อ-นามสกุล" },
      { key: "username", label: "Username", type: "text", required: true, maxLength: 30, placeholder: "กรอก Username" },
      { key: "department", label: "แผนก", type: "text", required: true, maxLength: 100, placeholder: "กรอกแผนก" },
      {
        key: "role",
        label: "สิทธิ์",
        type: "select",
        required: true,
        options: [
          { label: "Admin", value: "Admin" },
          { label: "Viewer", value: "Viewer" },
          { label: "Supplier", value: "Supplier" },
          { label: "Trainer", value: "Trainer" },
        ],
      },
      STATUS_FIELD,
    ],
    validationSchema: Yup.object({
      name: Yup.string().trim().min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร").max(100, "ชื่อต้องไม่เกิน 100 ตัวอักษร").required("กรุณากรอกชื่อผู้ใช้งาน"),
      username: Yup.string().trim().min(4, "Username ต้องมีอย่างน้อย 4 ตัวอักษร").max(30, "Username ต้องไม่เกิน 30 ตัวอักษร").matches(/^[A-Za-z0-9._-]+$/, "Username ใช้ได้เฉพาะภาษาอังกฤษ ตัวเลข จุด - และ _").required("กรุณากรอก Username"),
      department: Yup.string().trim().required("กรุณากรอกแผนก"),
      role: Yup.string().oneOf(["Admin", "Viewer", "Supplier", "Trainer"], "กรุณาเลือกสิทธิ์").required("กรุณาเลือกสิทธิ์"),
      status: statusValidation,
    }),
    rows: userPermissionMockup as SettingRow[],
  },

  positions: {
    title: "Positions",
    thaiTitle: "ตำแหน่ง",
    description: "จัดการตำแหน่งของพนักงาน",
    addLabel: "เพิ่มตำแหน่ง",
    icon: Shapes,
    columns: [
      { key: "code", label: "รหัส" },
      { key: "name", label: "ชื่อตำแหน่ง" },
      { key: "description", label: "รายละเอียด" },
      { key: "status", label: "สถานะ" },
    ],
    formFields: [
      { key: "code", label: "รหัสตำแหน่ง", type: "text", required: true, maxLength: 30, placeholder: "เช่น ENGINEER" },
      { key: "name", label: "ชื่อตำแหน่ง", type: "text", required: true, maxLength: 100, placeholder: "กรอกชื่อตำแหน่ง" },
      DESCRIPTION_FIELD,
      STATUS_FIELD,
    ],
    validationSchema: Yup.object({
      code: codeValidation,
      name: Yup.string().trim().required("กรุณากรอกชื่อตำแหน่ง"),
      description: Yup.string().trim().max(500, "รายละเอียดต้องไม่เกิน 500 ตัวอักษร"),
      status: statusValidation,
    }),
    rows: positionMockup as SettingRow[],
  },

  suppliers: {
    title: "Suppliers",
    thaiTitle: "บริษัท",
    description: "จัดการรายชื่อบริษัท",
    addLabel: "เพิ่มรายชื่อบริษัท",
    icon: Shapes,
    columns: [
      { key: "rowNumber", label: "ลำดับ", accessor: (_row, rowIndex) => rowIndex + 1, cellClassName: "w-20 font-semibold text-muted" },
      { key: "supplierNameTH", label: "ชื่อบริษัท (ไทย)" },
      { key: "supplierNameEN", label: "ชื่อบริษัท (อังกฤษ)" },
      { key: "address", label: "ที่อยู่" },
      { key: "status", label: "สถานะ" },
    ],
    formFields: [
      { key: "supplierNameTH", label: "ชื่อบริษัท (ไทย)", type: "text", required: true, maxLength: 200, placeholder: "กรอกชื่อบริษัทภาษาไทย" },
      { key: "supplierNameEN", label: "ชื่อบริษัท (อังกฤษ)", type: "text", maxLength: 200, placeholder: "กรอกชื่อบริษัทภาษาอังกฤษ" },
      { key: "address", label: "ที่อยู่", type: "textarea", fullWidth: true, maxLength: 500, placeholder: "กรอกที่อยู่บริษัท" },
      STATUS_FIELD,
    ],
    validationSchema: Yup.object({
      supplierNameTH: Yup.string().trim().required("กรุณากรอกชื่อบริษัทภาษาไทย"),
      supplierNameEN: Yup.string().trim().max(200, "ชื่อบริษัทต้องไม่เกิน 200 ตัวอักษร"),
      address: Yup.string().trim().max(500, "ที่อยู่ต้องไม่เกิน 500 ตัวอักษร"),
      status: statusValidation,
    }),
    rows: supplierMockup as SettingRow[],
  },

  categories: {
    title: "Category",
    thaiTitle: "หมวดหมู่หลักสูตร",
    description: "กำหนดหมวดหมู่สำหรับจัดกลุ่มหลักสูตรอบรม",
    addLabel: "เพิ่มหมวดหมู่",
    icon: Tags,
    columns: [
      { key: "code", label: "รหัส" },
      { key: "name", label: "ชื่อหมวดหมู่" },
      { key: "description", label: "รายละเอียด" },
      { key: "courseCount", label: "จำนวนหลักสูตร" },
      { key: "status", label: "สถานะ" },
    ],
    formFields: [
      { key: "code", label: "รหัสหมวดหมู่", type: "text", required: true, maxLength: 30, placeholder: "เช่น SAFETY" },
      { key: "name", label: "ชื่อหมวดหมู่", type: "text", required: true, maxLength: 100, placeholder: "กรอกชื่อหมวดหมู่" },
      { key: "courseCount", label: "จำนวนหลักสูตร", type: "number", defaultValue: "0", min: 0 },
      DESCRIPTION_FIELD,
      STATUS_FIELD,
    ],
    validationSchema: Yup.object({
      code: codeValidation,
      name: Yup.string().trim().required("กรุณากรอกชื่อหมวดหมู่"),
      courseCount: Yup.number().typeError("จำนวนหลักสูตรต้องเป็นตัวเลข").integer("จำนวนหลักสูตรต้องเป็นจำนวนเต็ม").min(0, "จำนวนหลักสูตรต้องไม่น้อยกว่า 0"),
      description: Yup.string().trim().max(500, "รายละเอียดต้องไม่เกิน 500 ตัวอักษร"),
      status: statusValidation,
    }),
    rows: [
      { id: 1, code: "SAFETY", name: "ความปลอดภัย", description: "หลักสูตรอบรมด้านความปลอดภัยในการทำงาน", courseCount: 12, status: "active" },
      { id: 2, code: "TECHNICAL", name: "ทักษะเฉพาะทาง", description: "หลักสูตรอบรมด้านเทคนิคและการปฏิบัติงาน", courseCount: 8, status: "active" },
      { id: 3, code: "MANAGEMENT", name: "การบริหารจัดการ", description: "หลักสูตรสำหรับหัวหน้างานและผู้บริหาร", courseCount: 5, status: "active" },
      { id: 4, code: "GENERAL", name: "ความรู้ทั่วไป", description: "หลักสูตรทั่วไปสำหรับพนักงาน", courseCount: 3, status: "inactive" },
    ],
  },

  types: {
    title: "Course Type",
    thaiTitle: "ประเภทหลักสูตร",
    description: "กำหนดรูปแบบและประเภทของการจัดอบรม",
    addLabel: "เพิ่มประเภท",
    icon: Shapes,
    columns: [
      { key: "code", label: "รหัส" },
      { key: "name", label: "ชื่อประเภท" },
      { key: "category", label: "หมวดหมู่" },
      { key: "description", label: "รายละเอียด" },
      { key: "status", label: "สถานะ" },
    ],
    formFields: [
      { key: "code", label: "รหัสประเภท", type: "text", required: true, maxLength: 30, placeholder: "เช่น INTERNAL" },
      { key: "name", label: "ชื่อประเภท", type: "text", required: true, maxLength: 100, placeholder: "กรอกชื่อประเภท" },
      { key: "category", label: "หมวดหมู่", type: "text", required: true, maxLength: 100, placeholder: "กรอกหมวดหมู่" },
      DESCRIPTION_FIELD,
      STATUS_FIELD,
    ],
    validationSchema: Yup.object({
      code: codeValidation,
      name: Yup.string().trim().required("กรุณากรอกชื่อประเภท"),
      category: Yup.string().trim().required("กรุณากรอกหมวดหมู่"),
      description: Yup.string().trim().max(500, "รายละเอียดต้องไม่เกิน 500 ตัวอักษร"),
      status: statusValidation,
    }),
    rows: [
      { id: 1, code: "INTERNAL", name: "อบรมภายใน", category: "ความปลอดภัย", description: "จัดอบรมโดยวิทยากรภายในบริษัท", status: "active" },
      { id: 2, code: "EXTERNAL", name: "อบรมภายนอก", category: "ทักษะเฉพาะทาง", description: "ส่งพนักงานเข้าอบรมกับหน่วยงานภายนอก", status: "active" },
      { id: 3, code: "ONLINE", name: "Online Training", category: "ความรู้ทั่วไป", description: "เรียนผ่านระบบออนไลน์", status: "active" },
      { id: 4, code: "ONSITE", name: "On-site Training", category: "ความปลอดภัย", description: "จัดอบรมภายในพื้นที่ปฏิบัติงาน", status: "inactive" },
    ],
  },
};
