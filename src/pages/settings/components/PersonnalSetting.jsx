import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";
import {
    CheckCircle2,
  Droplets,
  Globe2,
  Pencil,
  Plus,
  Search,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";

import DataTable from "../../../components/DataTable";
import { Button } from "../../../components/Ui";

const settingConfig = {
  nationalities: {
    title: "สัญชาติ", 
    description: "จัดการรายการสัญชาติของพนักงาน",
    addLabel: "เพิ่มสัญชาติ",
    icon: Globe2,
  },
  bloodTypes: {
    title: "กรุ๊ปเลือด",
    description: "จัดการตัวเลือกกรุ๊ปเลือดของพนักงาน",
    addLabel: "เพิ่มกรุ๊ปเลือด",
    icon: Droplets,
  },
genders: {
  title: "เพศ",
  description: "จัดการตัวเลือกเพศของพนักงาน",
  addLabel: "เพิ่มเพศ",
  icon: UsersRound,
},
  prefixes: {
    title: "คำนำหน้าชื่อ",
    description: "จัดการคำนำหน้าชื่อของพนักงาน",
    addLabel: "เพิ่มคำนำหน้า",
    icon: UserRound,
  },
};

const initialData = {
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

const EMPTY_FORM = {
  code: "",
  nameTh: "",
  nameEn: "",
  status: "active",
};

function StatusBadge({ value }) {
  const isActive = value === "active";

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full
        px-3 py-1.5 text-xs font-semibold
        ${
          isActive
            ? "bg-success-50 text-success-600"
            : "bg-slate-100 text-slate-500"
        }
      `}
    >
      {isActive && <CheckCircle2 size={14} />}
      {isActive ? "ใช้งาน" : "ไม่ใช้งาน"}
    </span>
  );
}

function PersonalSettingModal({
  open,
  mode,
  setting,
  initialValue,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const isEdit = mode === "edit";

  useEffect(() => {
    if (!open) return;

    setForm({
      ...EMPTY_FORM,
      ...initialValue,
    });
  }, [open, initialValue]);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSave({
      ...form,
      code: form.code.trim().toUpperCase(),
      nameTh: form.nameTh.trim(),
      nameEn: form.nameEn.trim(),
    });
  };

  return createPortal(
    <div
      role="presentation"
      className="
        fixed inset-0 z-[9999] overflow-y-auto
        bg-slate-950/60 backdrop-blur-sm
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="personal-setting-modal-title"
          className="
            w-full max-w-xl overflow-hidden
            rounded-2xl bg-white shadow-2xl
          "
          onMouseDown={(event) => event.stopPropagation()}
        >
          <div
            className="
              flex items-center justify-between gap-4
              border-b border-border
              bg-gradient-to-r from-brand-50 via-white to-amber-50/50
              px-5 py-4 sm:px-6
            "
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                className="
                  flex h-10 w-10 shrink-0 items-center justify-center
                  rounded-xl bg-brand-600 text-white
                "
              >
                <setting.icon size={20} />
              </span>

              <div>
                <h2
                  id="personal-setting-modal-title"
                  className="font-bold text text-lg font-bold text-heading"
                >
                  {isEdit ? `แก้ไข${setting.title}` : setting.addLabel}
                </h2>

                <p className="mt-0.5 text-sm text-muted">
                  กรอกข้อมูลให้ครบถ้วนก่อนบันทึก
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="ปิดหน้าต่าง"
              onClick={onClose}
              className="
                flex h-9 w-9 shrink-0 items-center justify-center
                rounded-xl text-slate-400 transition
                hover:bg-slate-100 hover:text-slate-700
              "
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-5 px-5 py-6 sm:grid-cols-2 sm:px-6">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-body">
                  รหัส <span className="text-danger-600">*</span>
                </span>

                <input
                  required
                  autoFocus
                  value={form.code}
                  placeholder="เช่น TH"
                  onChange={(event) =>
                    updateField("code", event.target.value.toUpperCase())
                  }
                  className="
                    h-11 w-full rounded-control border border-border
                    px-3.5 text-sm uppercase text-body outline-none
                    transition placeholder:text-placeholder
                    focus:border-brand-500 focus:ring-4 focus:ring-brand-100
                  "
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-body">
                  สถานะ <span className="text-danger-600">*</span>
                </span>

                <select
                  required
                  value={form.status}
                  onChange={(event) =>
                    updateField("status", event.target.value)
                  }
                  className="
                    h-11 w-full rounded-control border border-border
                    bg-white px-3.5 text-sm text-body outline-none
                    transition focus:border-brand-500
                    focus:ring-4 focus:ring-brand-100
                  "
                >
                  <option value="active">ใช้งาน</option>
                  <option value="inactive">ไม่ใช้งาน</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-body">
                  ชื่อภาษาไทย <span className="text-danger-600">*</span>
                </span>

                <input
                  required
                  value={form.nameTh}
                  placeholder={`กรอก${setting.title}ภาษาไทย`}
                  onChange={(event) =>
                    updateField("nameTh", event.target.value)
                  }
                  className="
                    h-11 w-full rounded-control border border-border
                    px-3.5 text-sm text-body outline-none
                    transition placeholder:text-placeholder
                    focus:border-brand-500 focus:ring-4 focus:ring-brand-100
                  "
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-body">
                  ชื่อภาษาอังกฤษ
                </span>

                <input
                  value={form.nameEn}
                  placeholder={`กรอก${setting.title}ภาษาอังกฤษ`}
                  onChange={(event) =>
                    updateField("nameEn", event.target.value)
                  }
                  className="
                    h-11 w-full rounded-control border border-border
                    px-3.5 text-sm text-body outline-none
                    transition placeholder:text-placeholder
                    focus:border-brand-500 focus:ring-4 focus:ring-brand-100
                  "
                />
              </label>
            </div>

            <div
              className="
                flex flex-col-reverse gap-3 border-t border-border
                bg-slate-50/70 px-5 py-4
                sm:flex-row sm:justify-end sm:px-6
              "
            >
              <Button type="button" variant="secondary" onClick={onClose}>
                ยกเลิก
              </Button>

              <Button type="submit">
                {isEdit ? "บันทึกการแก้ไข" : "เพิ่มข้อมูล"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function PersonalSetting() {
  const [activeSetting, setActiveSetting] = useState("nationalities");
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");

  const [modal, setModal] = useState({
    open: false,
    mode: "create",
    row: null,
  });

  const currentSetting = settingConfig[activeSetting];
  const CurrentIcon = currentSetting.icon;
  const currentRows = data[activeSetting] ?? [];

  const columns = useMemo(
    () => [
      {
        key: "rowNumber",
        label: "ลำดับ",
        accessor: (_row, rowIndex) => rowIndex + 1,
        cellClassName: "w-20 font-semibold text-muted",
      },
      {
        key: "code",
        label: "รหัส",
        accessor: "code",
        cell: ({ value }) => (
          <span className="font-mono font-semibold text-brand-600">
            {value}
          </span>
        ),
      },
      {
        key: "nameTh",
        label: "ชื่อภาษาไทย",
        accessor: "nameTh",
        cell: ({ value }) => (
          <span className="font-semibold text-heading">{value}</span>
        ),
      },
      {
        key: "nameEn",
        label: "ชื่อภาษาอังกฤษ",
        accessor: "nameEn",
      },
      {
        key: "status",
        label: "สถานะ",
        accessor: "status",
        cell: ({ value }) => <StatusBadge value={value} />,
      },
    ],
    [],
  );

  const filteredRows = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return currentRows;

    return currentRows.filter((row) =>
      [row.code, row.nameTh, row.nameEn, row.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword)),
    );
  }, [currentRows, search]);

  const handleSelectSetting = (key) => {
    setActiveSetting(key);
    setSearch("");
  };

  const handleCreate = () => {
    setModal({
      open: true,
      mode: "create",
      row: null,
    });
  };

  const handleEdit = (row) => {
    setModal({
      open: true,
      mode: "edit",
      row,
    });
  };

  const handleCloseModal = () => {
    setModal({
      open: false,
      mode: "create",
      row: null,
    });
  };

  const handleSave = (form) => {
    setData((current) => {
      const rows = current[activeSetting] ?? [];

      if (modal.mode === "edit") {
        return {
          ...current,
          [activeSetting]: rows.map((row) =>
            row.id === modal.row.id
              ? {
                  ...row,
                  ...form,
                }
              : row,
          ),
        };
      }

      const nextId =
        rows.length > 0
          ? Math.max(...rows.map((row) => Number(row.id))) + 1
          : 1;

      return {
        ...current,
        [activeSetting]: [
          ...rows,
          {
            id: nextId,
            ...form,
          },
        ],
      };
    });

    handleCloseModal();
  };

  return (
    <section className="space-y-6">
      {/* เมนูประเภทข้อมูล */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Object.entries(settingConfig).map(([key, setting]) => {
          const Icon = setting.icon;
          const isActive = key === activeSetting;
          const total = data[key]?.length ?? 0;

          return (
            <button
              key={key}
              type="button"
              onClick={() => handleSelectSetting(key)}
              className={`
                group rounded-card border p-4 text-left transition
                ${
                  isActive
                    ? "border-brand-600 bg-brand-600 text-white shadow-lg shadow-brand-900/15"
                    : "border-border bg-surface text-body hover:border-brand-200 hover:bg-brand-50"
                }
              `}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`
                    flex h-10 w-10 items-center justify-center rounded-xl
                    ${
                      isActive
                        ? "bg-white/15 text-white"
                        : "bg-brand-50 text-brand-600 group-hover:bg-white"
                    }
                  `}
                >
                  <Icon size={20} />
                </span>

                <span
                  className={`
                    rounded-full px-2.5 py-1 text-xs font-semibold
                    ${
                      isActive
                        ? "bg-white/15 text-white"
                        : "bg-slate-100 text-muted"
                    }
                  `}
                >
                  {total} รายการ
                </span>
              </div>

              <p className="mt-3 font-bold">{setting.title}</p>

              <p
                className={`mt-1 text-xs ${
                  isActive ? "text-white/70" : "text-muted"
                }`}
              >
                {setting.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* ตาราง */}
      <div className="overflow-hidden rounded-card border border-border bg-surface shadow-card">
        <div className="border-b border-border px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <CurrentIcon size={22} />
              </span>

              <div>
                <h2 className="text-xl font-bold text-heading">
                  {currentSetting.title}
                </h2>

                <p className="mt-1 text-sm text-muted">
                  {currentSetting.description}
                </p>
              </div>
            </div>

            <Button className="w-full xl:w-auto" onClick={handleCreate}>
              <Plus size={18} />
              {currentSetting.addLabel}
            </Button>
          </div>

          <div className="relative mt-5 max-w-md">
            <Search
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`ค้นหา${currentSetting.title}...`}
              className="
                h-11 w-full rounded-control border border-border
                bg-white pl-10 pr-4 text-sm text-body outline-none
                transition placeholder:text-placeholder
                focus:border-brand-500 focus:ring-4 focus:ring-brand-100
              "
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredRows}
          rowKey="id"
          emptyMessage={`ไม่พบข้อมูล${currentSetting.title}`}
          actions={(row) => (
            <button
              type="button"
              title="แก้ไข"
              onClick={() => handleEdit(row)}
              className="
                rounded-lg p-2 text-brand-600
                transition hover:bg-brand-50
              "
            >
              <Pencil size={17} />
            </button>
          )}
        />

        <div className="border-t border-border bg-slate-50/70 px-5 py-3">
          <p className="text-xs text-muted">
            แสดง {filteredRows.length} จาก {currentRows.length} รายการ
          </p>
        </div>
      </div>

      <PersonalSettingModal
        open={modal.open}
        mode={modal.mode}
        setting={currentSetting}
        initialValue={modal.row}
        onClose={handleCloseModal}
        onSave={handleSave}
      />
    </section>
  );
}