import { useMemo, useState } from "react";
import {
  KeyRound,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UsersRound,
} from "lucide-react";
import DataTable from "../../../components/DataTable";
import { Button } from "../../../components/Ui";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { selectRbac } from "../../../features/rbac/rbacSelectors";
import { deleteAccessItem } from "../../../features/rbac/rbacSlice";
import type { AccessRole, AccessUser } from "../../../features/rbac/rbac.types";
import RoleFormModal from "../modals/RoleFormModal";
import UserFormModal from "../modals/UserFormModal";
import UserPermissionModal from "../modals/UserPermissionModal";
import type { SettingRow } from "../settings.types";
export default function AccessSettingsPanel({
  kind,
}: {
  kind: "roles" | "users";
}) {
  const state = useAppSelector(selectRbac);
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<{
    role?: AccessRole;
    user?: AccessUser;
  } | null>(null);
  const [permissionUserId, setPermissionUserId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const isRole = kind === "roles";
  const FormModal = isRole ? RoleFormModal : UserFormModal;
  const Icon = isRole ? ShieldCheck : UsersRound;
  const rows = useMemo<SettingRow[]>(() => {
    const allRows: SettingRow[] = isRole
      ? state.roles.map((role) => ({
          ...role,
          permissionCount: role.permissions.length,
          memberCount: state.users.filter((user) =>
            user.roleIds.includes(role.id),
          ).length,
        }))
      : state.users.map((user) => ({
          id: user.id,
          name: user.name,
          username: user.username,
          department: user.department,
          status: user.status,
          roleNames:
            state.roles
              .filter((role) => user.roleIds.includes(role.id))
              .map(
                (role) =>
                  `${role.name}${role.status === "inactive" ? " (ปิดใช้งาน)" : ""}`,
              )
              .join(", ") || "ยังไม่มีบทบาท",
        }));
    const query = search.trim().toLowerCase();
    return allRows.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(query),
      ),
    );
  }, [state, search, isRole]);
  const columns = (
    isRole
      ? [
          {
            id: "name",
            header: "บทบาท",
            accessor: "name",
          },
          {
            id: "description",
            header: "รายละเอียด",
            accessor: "description",
          },
          {
            id: "permissionCount",
            header: "สิทธิ์",
            accessor: "permissionCount",
          },
          {
            id: "memberCount",
            header: "ผู้ใช้งาน",
            accessor: "memberCount",
          },
        ]
      : [
          {
            id: "name",
            header: "ชื่อผู้ใช้งาน",
            accessor: "name",
          },
          {
            id: "username",
            header: "Username",
            accessor: "username",
          },
          {
            id: "department",
            header: "แผนก",
            accessor: "department",
          },
          {
            id: "roleNames",
            header: "บทบาท",
            accessor: "roleNames",
          },
        ]
  )
    .concat([
      {
        id: "status",
        header: "สถานะ",
        accessor: "status",
      },
    ])
    .map((column) => ({
      ...column,
      cell: ({ value }: { value: unknown }) =>
        column.id === "status" ? (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${value === "active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
          >
            {value === "active" ? "ใช้งาน" : "ปิดใช้งาน"}
          </span>
        ) : (
          <span
            className={
              column.id === "name" ? "font-semibold text-heading" : "text-sm"
            }
          >
            {String(value ?? "—")}
          </span>
        ),
    }));
  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface shadow-card">
      <div className="border-b border-border p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-brand-50 p-3 text-brand-600">
              <Icon size={22} />
            </span>
            <div>
              <h1 className="text-xl font-bold text-heading">
                {isRole ? "บทบาทและสิทธิ์การเข้าถึง" : "ผู้ใช้งาน"}
              </h1>
              <p className="mt-1 text-sm text-muted">
                {isRole
                  ? "สร้างบทบาทและเลือกสิทธิ์ตามหน้าที่การทำงาน"
                  : "จัดการข้อมูลผู้ใช้และกำหนดบทบาท"}
              </p>
            </div>
          </div>
          <Button
            type="button"
            onClick={() => {
              setError("");
              setModal({});
            }}
          >
            <Plus size={18} />
            {isRole ? "เพิ่มบทบาท" : "เพิ่มผู้ใช้งาน"}
          </Button>
        </div>
        <label className="relative mt-5 block max-w-md">
          <span className="sr-only">ค้นหา</span>
          <Search size={18} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={
              isRole ? "ค้นหาบทบาท..." : "ค้นหาชื่อ Username หรือบทบาท..."
            }
            className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-600"
          />
        </label>
        {error && (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}
      </div>
      <DataTable
        columns={columns}
        data={rows}
        rowKey="id"
        emptyMessage="ไม่พบข้อมูล"
        actions={(row: SettingRow) => (
          <div className="inline-flex gap-1">
            {!isRole && (
              <button
                type="button"
                aria-label={`กำหนดสิทธิ์ ${String(row.name)}`}
                title="กำหนดสิทธิ์"
                onClick={() => setPermissionUserId(String(row.id))}
                className="rounded-lg p-2 text-amber-600 hover:bg-amber-50"
              >
                <KeyRound size={17} />
              </button>
            )}
            <button
              type="button"
              aria-label={`แก้ไข ${String(row.name)}`}
              title="แก้ไข"
              onClick={() => {
                setError("");
                setModal(
                  isRole
                    ? {
                        role: state.roles.find(
                          (role) => role.id === String(row.id),
                        ),
                      }
                    : {
                        user: state.users.find(
                          (user) => user.id === String(row.id),
                        ),
                      },
                );
              }}
              className="rounded-lg p-2 text-brand-600 hover:bg-brand-50"
            >
              <Pencil size={17} />
            </button>
            <button
              type="button"
              aria-label={`ลบ ${String(row.name)}`}
              title="ลบ"
              onClick={() => {
                if (!window.confirm(`ยืนยันลบ ${String(row.name)}?`)) return;
                try {
                  dispatch(deleteAccessItem(kind, String(row.id)));
                  setError("");
                } catch (cause) {
                  setError(
                    cause instanceof Error ? cause.message : "ลบไม่สำเร็จ",
                  );
                }
              }}
              className="rounded-lg p-2 text-red-600 hover:bg-red-50"
            >
              <Trash2 size={17} />
            </button>
          </div>
        )}
      />
      <footer className="flex justify-between border-t border-border bg-slate-50 px-5 py-3 text-xs text-muted">
        <span>แสดง {rows.length} รายการ</span>
        <span>ข้อมูลจาก Redux</span>
      </footer>
      {permissionUserId && (
        <UserPermissionModal
          userId={permissionUserId}
          onClose={() => setPermissionUserId(null)}
        />
      )}
      {modal && (
        <FormModal
          role={modal.role}
          user={modal.user}
          state={state}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
