import {
  BuildingComplex,
  HardHat,
  Houses,
  Landmark,
  Shapes,
  Tags,
  UsersRound,
} from "lucide-react";
import * as Yup from "yup";
import type {
  SettingDefinition,
  SettingFormField,
  SettingMenuKey,
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
  // Roles/users use AccessSettingsPanel and AccessFormModal instead of the generic form.
  roles: {
    title: "Role & Permission",
    thaiTitle: "บทบาทและสิทธิ์การเข้าถึง",
    description: "สร้างบทบาทและกำหนดสิทธิ์การใช้งาน",
    addLabel: "เพิ่มบทบาท",
    icon: UsersRound,
    columns: [],
    formFields: [],
    validationSchema: Yup.object({}),
  },
  users: {
    title: "User",
    thaiTitle: "ผู้ใช้งาน",
    description: "จัดการบัญชีผู้ใช้งานและกำหนดบทบาท",
    addLabel: "เพิ่มผู้ใช้งาน",
    icon: UsersRound,
    columns: [],
    formFields: [],
    validationSchema: Yup.object({}),
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
      {
        key: "code",
        label: "รหัสตำแหน่ง",
        type: "text",
        required: true,
        maxLength: 30,
        placeholder: "เช่น ENGINEER",
      },
      {
        key: "name",
        label: "ชื่อตำแหน่ง",
        type: "text",
        required: true,
        maxLength: 100,
        placeholder: "กรอกชื่อตำแหน่ง",
      },
      DESCRIPTION_FIELD,
      STATUS_FIELD,
    ],
    validationSchema: Yup.object({
      code: codeValidation,
      name: Yup.string().trim().required("กรุณากรอกชื่อตำแหน่ง"),
      description: Yup.string()
        .trim()
        .max(500, "รายละเอียดต้องไม่เกิน 500 ตัวอักษร"),
      status: statusValidation,
    }),
  },

  companies: {
    title: "Companies",
    thaiTitle: "บริษัท/สังกัด",
    description: "จัดการข้อมูลบริษัทและสังกัดของพนักงาน",
    addLabel: "เพิ่มบริษัท/สังกัด",
    icon: BuildingComplex,
    columns: [
      { key: "code", label: "รหัสบริษัท/สังกัด" },
      { key: "name", label: "ชื่อบริษัท/สังกัด" },
      { key: "description", label: "รายละเอียด" },
      { key: "status", label: "สถานะ" },
    ],
    formFields: [
      {
        key: "code",
        label: "รหัสบริษัท/สังกัด",
        type: "text",
        required: true,
        maxLength: 30,
        placeholder: "เช่น COMP001",
      },
      {
        key: "name",
        label: "ชื่อบริษัท/สังกัด",
        type: "text",
        required: true,
        maxLength: 100,
        placeholder: "กรอกชื่อบริษัทหรือสังกัด",
      },
      DESCRIPTION_FIELD,
      STATUS_FIELD,
    ],
    validationSchema: Yup.object({
      code: codeValidation,
      name: Yup.string()
        .trim()
        .max(100, "ชื่อบริษัท/สังกัดต้องไม่เกิน 100 ตัวอักษร")
        .required("กรุณากรอกชื่อบริษัท/สังกัด"),
      description: Yup.string()
        .trim()
        .max(500, "รายละเอียดต้องไม่เกิน 500 ตัวอักษร"),
      status: statusValidation,
    }),
  },

  department: {
    title: "Departments",
    thaiTitle: "แผนก",
    description: "จัดการข้อมูลแผนกของพนักงาน",
    addLabel: "เพิ่มแผนก",
    icon: Landmark,
    columns: [
      { key: "code", label: "รหัสแผนก" },
      { key: "name", label: "ชื่อแผนก" },
      { key: "description", label: "รายละเอียด" },
      { key: "status", label: "สถานะ" },
    ],
    formFields: [
      {
        key: "code",
        label: "รหัสแผนก",
        type: "text",
        required: true,
        maxLength: 30,
        placeholder: "เช่น DEP001",
      },
      {
        key: "name",
        label: "ชื่อแผนก",
        type: "text",
        required: true,
        maxLength: 100,
        placeholder: "กรอกชื่อแผนก",
      },
      DESCRIPTION_FIELD,
      STATUS_FIELD,
    ],
    validationSchema: Yup.object({
      code: codeValidation,
      name: Yup.string()
        .trim()
        .max(100, "ชื่อแผนกต้องไม่เกิน 100 ตัวอักษร")
        .required("กรุณากรอกชื่อแผนก"),
      description: Yup.string()
        .trim()
        .max(500, "รายละเอียดต้องไม่เกิน 500 ตัวอักษร"),
      status: statusValidation,
    }),
  },

  sections: {
    title: "Sections & Subsections",
    thaiTitle: "ส่วนงานและหน่วยงานย่อย",
    description: "จัดการส่วนงานและหน่วยงานย่อยที่เกี่ยวข้อง",
    addLabel: "เพิ่มส่วนงาน",
    icon: Shapes,
    columns: [
      { key: "code", label: "รหัสส่วนงาน" },
      { key: "name", label: "ชื่อส่วนงาน" },
      { key: "description", label: "รายละเอียด" },
      { key: "status", label: "สถานะ" },
    ],
    formFields: [
      {
        key: "code",
        label: "รหัสส่วนงาน",
        type: "text",
        required: true,
        maxLength: 30,
        placeholder: "เช่น SEC001",
      },
      {
        key: "name",
        label: "ชื่อส่วนงาน",
        type: "text",
        required: true,
        maxLength: 100,
        placeholder: "กรอกชื่อส่วนงาน",
      },
      DESCRIPTION_FIELD,
      STATUS_FIELD,
    ],
    validationSchema: Yup.object({
      code: codeValidation,
      name: Yup.string()
        .trim()
        .max(100, "ชื่อส่วนงานต้องไม่เกิน 100 ตัวอักษร")
        .required("กรุณากรอกชื่อส่วนงาน"),
      description: Yup.string()
        .trim()
        .max(500, "รายละเอียดต้องไม่เกิน 500 ตัวอักษร"),
      status: statusValidation,
    }),
  },

  subsections: {
    title: "Subsections",
    thaiTitle: "หน่วยงานย่อย",
    description: "จัดการข้อมูลหน่วยงานย่อยของพนักงาน",
    addLabel: "เพิ่มหน่วยงานย่อย",
    icon: Shapes,
    columns: [
      { key: "code", label: "รหัสหน่วยงานย่อย" },
      { key: "name", label: "ชื่อหน่วยงานย่อย" },
      { key: "description", label: "รายละเอียด" },
      { key: "status", label: "สถานะ" },
    ],
    formFields: [
      {
        key: "code",
        label: "รหัสหน่วยงานย่อย",
        type: "text",
        required: true,
        maxLength: 30,
        placeholder: "เช่น SUB001",
      },
      {
        key: "name",
        label: "ชื่อหน่วยงานย่อย",
        type: "text",
        required: true,
        maxLength: 100,
        placeholder: "กรอกชื่อหน่วยงานย่อย",
      },
      DESCRIPTION_FIELD,
      STATUS_FIELD,
    ],
    validationSchema: Yup.object({
      code: codeValidation,
      name: Yup.string()
        .trim()
        .max(100, "ชื่อหน่วยงานย่อยต้องไม่เกิน 100 ตัวอักษร")
        .required("กรุณากรอกชื่อหน่วยงานย่อย"),
      description: Yup.string()
        .trim()
        .max(500, "รายละเอียดต้องไม่เกิน 500 ตัวอักษร"),
      status: statusValidation,
    }),
  },

  camps: {
    title: "Camps",
    thaiTitle: "แคมป์",
    description: "จัดการข้อมูลแคมป์ที่พักของพนักงาน",
    addLabel: "เพิ่มแคมป์",
    icon: Houses,
    columns: [
      { key: "code", label: "รหัสแคมป์" },
      { key: "name", label: "ชื่อแคมป์" },
      { key: "description", label: "รายละเอียด" },
      { key: "status", label: "สถานะ" },
    ],
    formFields: [
      {
        key: "code",
        label: "รหัสแคมป์",
        type: "text",
        required: true,
        maxLength: 30,
        placeholder: "เช่น CAMP001",
      },
      {
        key: "name",
        label: "ชื่อแคมป์",
        type: "text",
        required: true,
        maxLength: 100,
        placeholder: "กรอกชื่อแคมป์",
      },
      DESCRIPTION_FIELD,
      STATUS_FIELD,
    ],
    validationSchema: Yup.object({
      code: codeValidation,
      name: Yup.string()
        .trim()
        .max(100, "ชื่อแคมป์ต้องไม่เกิน 100 ตัวอักษร")
        .required("กรุณากรอกชื่อแคมป์"),
      description: Yup.string()
        .trim()
        .max(500, "รายละเอียดต้องไม่เกิน 500 ตัวอักษร"),
      status: statusValidation,
    }),
  },

  subcontractors: {
    title: "Subcontracts",
    thaiTitle: "บริษัทผู้รับเหมา",
    description: "จัดการรายชื่อบริษัทผู้รับเหมา",
    addLabel: "เพิ่มรายชื่อบริษัทผู้รับเหมา",
    icon: HardHat,
    columns: [
      {
        key: "rowNumber",
        label: "ลำดับ",
        accessor: (_row, rowIndex) => rowIndex + 1,
        cellClassName: "w-20 font-semibold text-muted",
      },
      { key: "supplierNameTH", label: "ชื่อบริษัท (ไทย)" },
      { key: "supplierNameEN", label: "ชื่อบริษัท (อังกฤษ)" },
      { key: "address", label: "ที่อยู่" },
      { key: "status", label: "สถานะ" },
    ],
    formFields: [
      {
        key: "supplierNameTH",
        label: "ชื่อบริษัท (ไทย)",
        type: "text",
        required: true,
        maxLength: 200,
        placeholder: "กรอกชื่อบริษัทภาษาไทย",
      },
      {
        key: "supplierNameEN",
        label: "ชื่อบริษัท (อังกฤษ)",
        type: "text",
        maxLength: 200,
        placeholder: "กรอกชื่อบริษัทภาษาอังกฤษ",
      },
      {
        key: "address",
        label: "ที่อยู่",
        type: "textarea",
        fullWidth: true,
        maxLength: 500,
        placeholder: "กรอกที่อยู่บริษัท",
      },
      STATUS_FIELD,
    ],
    validationSchema: Yup.object({
      supplierNameTH: Yup.string()
        .trim()
        .required("กรุณากรอกชื่อบริษัทภาษาไทย"),
      supplierNameEN: Yup.string()
        .trim()
        .max(200, "ชื่อบริษัทต้องไม่เกิน 200 ตัวอักษร"),
      address: Yup.string().trim().max(500, "ที่อยู่ต้องไม่เกิน 500 ตัวอักษร"),
      status: statusValidation,
    }),
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
      {
        key: "code",
        label: "รหัสหมวดหมู่",
        type: "text",
        required: true,
        maxLength: 30,
        placeholder: "เช่น SAFETY",
      },
      {
        key: "name",
        label: "ชื่อหมวดหมู่",
        type: "text",
        required: true,
        maxLength: 100,
        placeholder: "กรอกชื่อหมวดหมู่",
      },
      {
        key: "courseCount",
        label: "จำนวนหลักสูตร",
        type: "number",
        defaultValue: "0",
        min: 0,
      },
      DESCRIPTION_FIELD,
      STATUS_FIELD,
    ],
    validationSchema: Yup.object({
      code: codeValidation,
      name: Yup.string().trim().required("กรุณากรอกชื่อหมวดหมู่"),
      courseCount: Yup.number()
        .typeError("จำนวนหลักสูตรต้องเป็นตัวเลข")
        .integer("จำนวนหลักสูตรต้องเป็นจำนวนเต็ม")
        .min(0, "จำนวนหลักสูตรต้องไม่น้อยกว่า 0"),
      description: Yup.string()
        .trim()
        .max(500, "รายละเอียดต้องไม่เกิน 500 ตัวอักษร"),
      status: statusValidation,
    }),
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
      {
        key: "code",
        label: "รหัสประเภท",
        type: "text",
        required: true,
        maxLength: 30,
        placeholder: "เช่น INTERNAL",
      },
      {
        key: "name",
        label: "ชื่อประเภท",
        type: "text",
        required: true,
        maxLength: 100,
        placeholder: "กรอกชื่อประเภท",
      },
      {
        key: "category",
        label: "หมวดหมู่",
        type: "text",
        required: true,
        maxLength: 100,
        placeholder: "กรอกหมวดหมู่",
      },
      DESCRIPTION_FIELD,
      STATUS_FIELD,
    ],
    validationSchema: Yup.object({
      code: codeValidation,
      name: Yup.string().trim().required("กรุณากรอกชื่อประเภท"),
      category: Yup.string().trim().required("กรุณากรอกหมวดหมู่"),
      description: Yup.string()
        .trim()
        .max(500, "รายละเอียดต้องไม่เกิน 500 ตัวอักษร"),
      status: statusValidation,
    }),
  },
};
