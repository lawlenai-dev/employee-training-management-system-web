import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { AnyObjectSchema } from "yup";

export type SettingMenuKey =
  | "users"
  | "positions"
  | "suppliers"
  | "categories"
  | "types";

export type SettingRow = {
  id: string | number;
  [key: string]: unknown;
};

export type SettingRowsByMenu = Record<SettingMenuKey, SettingRow[]>;

export type SettingFormValues = Record<string, string>;

export type SettingColumn = {
  key: string;
  label: string;
  accessor?: string | ((row: SettingRow, rowIndex: number) => unknown);
  headerClassName?: string;
  cellClassName?: string;
  cell?: (context: { value: unknown }) => ReactNode;
};

export type SettingFormField = {
  key: string;
  label: string;
  type: "text" | "number" | "email" | "select" | "textarea";
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  fullWidth?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  options?: Array<{ label: string; value: string }>;
};

export type SettingDefinition = {
  title: string;
  thaiTitle: string;
  description: string;
  addLabel: string;
  icon: LucideIcon;
  columns: SettingColumn[];
  formFields: SettingFormField[];
  validationSchema: AnyObjectSchema;
  rows: SettingRow[];
};
