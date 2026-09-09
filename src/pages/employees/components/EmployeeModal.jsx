import { useEffect, useMemo, useState } from "react";
import { ImagePlus, Save, Upload, UserPlus, X } from "lucide-react";
import { createPortal } from "react-dom";
import Autocomplete from "../../../components/Autocomplete";
import { Button, Input } from "../../../components/Ui";
import { positionMockup } from "../../../data";

const EMPTY_FORM = {
  employee_code: "",
  prefix: "",
  first_name: "",
  last_name: "",
  department: "",
  position: "",
  birth_date: "",
  nationality: "",
  company: "",
  gender: "",
  note: "",
  photo: null,
  photo_url: "",
  status: "active",
};

const prefixOptions = [
  { value: "mr", label: "นาย" },
  { value: "mrs", label: "นาง" },
  { value: "miss", label: "นางสาว" },
];

const statusOptions = [
  { value: "active", label: "ใช้งาน" },
  { value: "resigned", label: "ลาออก" },
  { value: "canceled", label: "ยกเลิก" },
];

const genderOptions = [
  { value: "male", label: "ชาย" },
  { value: "female", label: "หญิง" },
  { value: "other", label: "อื่น ๆ" },
];

function calculateAge(birthDate) {
  if (!birthDate) {
    return "";
  }

  const birth = new Date(birthDate);
  const today = new Date();

  if (Number.isNaN(birth.getTime()) || birth > today) {
    return "";
  }

  let age = today.getFullYear() - birth.getFullYear();

  const hasNotHadBirthday =
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() &&
      today.getDate() < birth.getDate());

  if (hasNotHadBirthday) {
    age -= 1;
  }

  return age;
}

function SelectField({
  label,
  required = false,
  value,
  onChange,
  options = [],
  disabled = false,
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-1 text-danger-600">*</span>}
      </span>

      <select
        required={required}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="
          h-11 w-full rounded-control border border-border
          bg-white px-3.5 text-sm text-body
          outline-none transition
          focus:border-brand-500 focus:ring-4 focus:ring-brand-100
          disabled:cursor-not-allowed disabled:bg-slate-100
          disabled:text-slate-500
        "
      >
        <option value="">กรุณาเลือก</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function EmployeeModal({
  open,
  mode = "create",
  initialData = null,
  departments = [],
  positions = [],
  nationalities = [],
  companies = [],
  saving = false,
  error = "",
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [previewUrl, setPreviewUrl] = useState("");

  const isEdit = mode === "edit";

  const age = useMemo(() => calculateAge(form.birth_date), [form.birth_date]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setForm({
      ...EMPTY_FORM,
      ...initialData,
      photo: null,
    });

    setPreviewUrl(initialData?.photo_url || "");
  }, [open, initialData]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!open) {
    return null;
  }

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };
  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !saving) {
        onClose();
      }
    };

    // ป้องกันหน้าเว็บด้านหลังเลื่อน
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, saving, onClose]);
  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      return;
    }

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    updateField("photo", file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemovePhoto = () => {
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl("");
    setForm((current) => ({
      ...current,
      photo: null,
      photo_url: "",
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Age ใช้แสดงผล ไม่แนะนำให้เก็บลง Database
    onSubmit({
      ...form,
      calculated_age: age,
    });
  };

  const selectedDepartment =
    departments.find((item) => item.code === form.department) || null;

  const selectedPosition =
    positions.find((item) => item.code === form.position) || null;

  const selectedNationality =
    nationalities.find((item) => item.code === form.nationality) || null;

  const selectedCompany =
    companies.find((item) => item.code === form.company) || null;
  return createPortal(
    <div
      role="presentation"
      className="
      fixed inset-0 z-[9999]
      overflow-y-auto overscroll-contain
      bg-slate-900/50 backdrop-blur-[2px]
    "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      {/* ตัวจัดตำแหน่ง Modal */}
      <div
        className="
        flex min-h-full items-start justify-center
        p-0 sm:items-center sm:p-6
      "
      >
        {/* Modal */}
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="employee-modal-title"
          className="
          relative w-full max-w-4xl
          overflow-hidden bg-white shadow-2xl
          sm:my-6 sm:rounded-2xl
        "
          onMouseDown={(event) => event.stopPropagation()}
        >
          {/* Header */}
          <div
            className="
            flex items-center justify-between
            border-b border-border
            bg-gradient-to-r from-brand-50 to-white
            px-5 py-4 sm:px-6
          "
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
                <UserPlus size={19} />
              </span>

              <div>
                <h2
                  id="employee-modal-title"
                  className="font-bold text-heading"
                >
                  {isEdit ? "แก้ไขข้อมูลพนักงาน" : "เพิ่มข้อมูลพนักงาน"}
                </h2>

                <p className="mt-0.5 text-sm text-muted">
                  กรอกข้อมูลพื้นฐานสำหรับสร้างบัญชีและบัตร QR
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="ปิดหน้าต่าง"
              disabled={saving}
              onClick={onClose}
              className="
              flex h-9 w-9 items-center justify-center
              rounded-lg text-slate-400 transition
              hover:bg-slate-100 hover:text-slate-700
              disabled:cursor-not-allowed disabled:opacity-50
            "
            >
              <X size={20} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex min-h-0 flex-1 flex-col"
          >
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {/* Employee code */}
                <Input
                  label="รหัสพนักงาน *"
                  required
                  placeholder="เช่น EMP001"
                  value={form.employee_code}
                  onChange={(event) =>
                    updateField(
                      "employee_code",
                      event.target.value.toUpperCase(),
                    )
                  }
                />

                {/* Prefix */}
                <SelectField
                  label="คำนำหน้าชื่อ"
                  required
                  value={form.prefix}
                  options={prefixOptions}
                  onChange={(value) => updateField("prefix", value)}
                />

                {/* First name */}
                <Input
                  label="ชื่อ *"
                  required
                  placeholder="กรอกชื่อ"
                  value={form.first_name}
                  onChange={(event) =>
                    updateField("first_name", event.target.value)
                  }
                />

                {/* Last name */}
                <Input
                  label="นามสกุล *"
                  required
                  placeholder="กรอกนามสกุล"
                  value={form.last_name}
                  onChange={(event) =>
                    updateField("last_name", event.target.value)
                  }
                />

                {/* Department */}
                <Autocomplete
                  label="แผนก *"
                  required
                  placeholder="ค้นหาแผนก"
                  options={departments}
                  value={selectedDepartment}
                  getOptionLabel={(option) => `${option.code} - ${option.name}`}
                  onChange={(option) => {
                    updateField("department", option?.code || "");

                    // เมื่อเปลี่ยนแผนกให้ล้างตำแหน่งเดิม
                    updateField("position", "");
                  }}
                />

                {/* Position */}
                <Autocomplete
                  label="ตำแหน่ง *"
                  required
                  placeholder="ค้นหาตำแหน่ง"
                  options={positionMockup}
                  value={selectedPosition}
                  getOptionLabel={(option) => `${option.code} - ${option.name}`}
                  onChange={(option) =>
                    updateField("position", option?.code || "")
                  }
                />

                {/* Birth date */}
                <Input
                  label="วันเกิด"
                  type="date"
                  value={form.birth_date}
                  onChange={(event) =>
                    updateField("birth_date", event.target.value)
                  }
                />

                {/* Age */}
                <Input
                  label="อายุ"
                  value={age !== "" ? `${age} ปี` : ""}
                  placeholder="คำนวณจากวันเกิด"
                  readOnly
                  disabled
                />

                {/* Nationality */}
                <Autocomplete
                  label="สัญชาติ"
                  placeholder="ค้นหาสัญชาติ"
                  options={nationalities}
                  value={selectedNationality}
                  getOptionLabel={(option) => `${option.code} - ${option.name}`}
                  onChange={(option) =>
                    updateField("nationality", option?.code || "")
                  }
                />

                {/* Company */}
                <Autocomplete
                  label="บริษัท"
                  placeholder="ค้นหาบริษัท"
                  options={companies}
                  value={selectedCompany}
                  getOptionLabel={(option) => `${option.code} - ${option.name}`}
                  onChange={(option) =>
                    updateField("company", option?.code || "")
                  }
                />

                {/* Status */}
                <SelectField
                  label="สถานะ *"
                  required
                  value={form.status}
                  options={statusOptions}
                  onChange={(value) => updateField("status", value)}
                />

                {/* Gender */}
                <fieldset>
                  <legend className="mb-2 block text-sm font-medium text-slate-700">
                    เพศ
                  </legend>

                  <div className="flex min-h-11 flex-wrap items-center gap-2">
                    {genderOptions.map((gender) => {
                      const checked = form.gender === gender.value;

                      return (
                        <label
                          key={gender.value}
                          className={`
                          flex cursor-pointer items-center gap-2
                          rounded-control border px-3.5 py-2
                          text-sm transition
                          ${
                            checked
                              ? "border-brand-500 bg-brand-50 font-semibold text-brand-700"
                              : "border-border bg-white text-body hover:border-brand-200 hover:bg-brand-50/50"
                          }
                        `}
                        >
                          <input
                            type="radio"
                            name="gender"
                            value={gender.value}
                            checked={checked}
                            onChange={(event) =>
                              updateField("gender", event.target.value)
                            }
                            className="h-4 w-4 accent-[#003274]"
                          />

                          {gender.label}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                {/* Note */}
                <label className="block md:col-span-2 xl:col-span-3">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    หมายเหตุ
                  </span>

                  <textarea
                    rows={4}
                    value={form.note}
                    placeholder="ระบุรายละเอียดหรือหมายเหตุเพิ่มเติม..."
                    onChange={(event) =>
                      updateField("note", event.target.value)
                    }
                    className="
                    w-full resize-none rounded-control
                    border border-border bg-white
                    px-3.5 py-3 text-sm text-body
                    outline-none transition
                    placeholder:text-placeholder
                    focus:border-brand-500
                    focus:ring-4 focus:ring-brand-100
                  "
                  />
                </label>

                {/* Photo */}
                <div className="md:col-span-2 xl:col-span-3">
                  <p className="mb-2 text-sm font-medium text-slate-700">
                    รูปพนักงาน
                  </p>

                  <div
                    className="
                    flex flex-col gap-4 rounded-2xl
                    border border-dashed border-brand-200
                    bg-brand-50/40 p-4 sm:flex-row
                    sm:items-center
                  "
                  >
                    <div
                      className="
                      flex h-28 w-28 shrink-0 items-center
                      justify-center overflow-hidden rounded-2xl
                      border border-border bg-white
                    "
                    >
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="ตัวอย่างรูปพนักงาน"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImagePlus size={30} className="text-slate-300" />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold text-heading">
                        แนบรูปพนักงาน
                      </p>

                      <p className="mt-1 text-xs leading-5 text-muted">
                        รองรับไฟล์ JPG, JPEG, PNG หรือ WEBP แนะนำรูปถ่ายหน้าตรง
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <label
                          className="
                          inline-flex cursor-pointer items-center
                          gap-2 rounded-control bg-brand-600
                          px-4 py-2 text-sm font-semibold
                          text-white transition hover:bg-brand-700
                        "
                        >
                          <Upload size={16} />
                          เลือกรูปภาพ
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handlePhotoChange}
                            className="hidden"
                          />
                        </label>

                        {previewUrl && (
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="
                            rounded-control border border-border
                            bg-white px-4 py-2 text-sm
                            font-semibold text-slate-600
                            transition hover:bg-slate-100
                          "
                          >
                            ลบรูป
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div
                    role="alert"
                    className="
                    rounded-control border border-danger-600/20
                    bg-danger-50 px-4 py-3
                    text-sm text-danger-700
                    md:col-span-2 xl:col-span-3
                  "
                  >
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div
              className="
              flex shrink-0 flex-col-reverse gap-3
              border-t border-border bg-slate-50/80
              px-5 py-4 sm:flex-row sm:justify-end sm:px-6
            "
            >
              <Button
                type="button"
                variant="secondary"
                disabled={saving}
                onClick={onClose}
              >
                ยกเลิก
              </Button>

              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    กำลังบันทึก...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    {isEdit ? "บันทึกการแก้ไข" : "บันทึกพนักงาน"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body,
  );
}
