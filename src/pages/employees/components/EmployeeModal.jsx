import { UserPlus, X } from "lucide-react";
import { Button, Input } from "../../../components/Ui";
import Autocomplete from "../../../components/Autocomplete";
import { positionMockup } from "../../../data";

export default function EmployeeModal({
  open,
  onClose,
  form,
  setForm,
  onSubmit,
  error,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-brand-50 to-white px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
              <UserPlus size={19} />
            </span>

            <div>
              <h2 className="font-bold text-heading">เพิ่มข้อมูลพนักงาน</h2>

              <p className="mt-0.5 text-sm text-muted">
                กรอกข้อมูลพื้นฐานสำหรับสร้างบัญชีและบัตร QR
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="grid gap-5 p-5 sm:p-6 md:grid-cols-2 xl:grid-cols-3"
        >
          <Input
            label="รหัสพนักงาน *"
            required
            placeholder="เช่น EMP001"
            value={form.employee_code}
            onChange={(event) =>
              setForm({
                ...form,
                employee_code: event.target.value.toUpperCase(),
              })
            }
          />

          <Input
            label="ชื่อ *"
            required
            placeholder="กรอกชื่อ"
            value={form.first_name}
            onChange={(event) =>
              setForm({
                ...form,
                first_name: event.target.value,
              })
            }
          />

          <Input
            label="นามสกุล *"
            required
            placeholder="กรอกนามสกุล"
            value={form.last_name}
            onChange={(event) =>
              setForm({
                ...form,
                last_name: event.target.value,
              })
            }
          />

          <Input
            label="แผนก"
            placeholder="เช่น Safety"
            value={form.department}
            onChange={(event) =>
              setForm({
                ...form,
                department: event.target.value,
              })
            }
          />

          <Autocomplete
            label="ตำแหน่ง"
            placeholder="ค้นหาตำแหน่ง เช่น PM"
            options={positionMockup}
            value={
              positionMockup.find((item) => item.code === form.position) || null
            }
            getOptionLabel={(option) => `${option.code} - ${option.name}`}
            onChange={(option) =>
              setForm({
                ...form,
                position: option?.code || "",
              })
            }
          />
          {/* Error */}
          {error && (
            <div className="self-end rounded-control border border-danger-600/20 bg-danger-50 px-4 py-3 text-sm text-danger-700">
              {error}
            </div>
          )}

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end md:col-span-2 xl:col-span-3">
            <Button type="button" variant="secondary" onClick={onClose}>
              ยกเลิก
            </Button>

            <Button type="submit">
              <UserPlus size={18} />
              บันทึกพนักงาน
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
