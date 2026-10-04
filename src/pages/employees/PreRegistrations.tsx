import { Building2, ClipboardCheck, Clock3, Eye } from "lucide-react";
import { useMemo, useState } from "react";
import PreRegistrationReviewModal from "./components/PreRegistrationReviewModal";
import { useAuth } from "../../auth/AuthContext";
import {
  usePreRegistrations,
  getRequestHistory,
  type PreRegistration,
} from "../../auth/PreRegistrationContext";
import DataTable from "../../components/DataTable";
import type { DataTableColumn } from "../../components/DataTable";
import HeroCover from "../../components/HeroCover";
import { Card, Empty, PageTitle } from "../../components/Ui";

const statusLabels = {
  pending: "รอตรวจสอบ",
  approved: "อนุมัติแล้ว",
  rejected: "ไม่อนุมัติ",
} as const;

export default function PreRegistrations() {
  const { user, hasPermission } = useAuth();
  const { requests, approveRequest, rejectRequest } = usePreRegistrations();
    console.log("request", requests);
  
  const [review, setReview] = useState<{
    request: PreRegistration;
  } | null>(null);
  const canReview = hasPermission("preregistration.review");

  const visibleRequests = useMemo(
    () =>
      canReview
        ? requests
        : requests.filter((request) => request.supplierId === user?.supplierId),
    [canReview, requests, user?.supplierId],
  );

  const pendingCount = visibleRequests.filter(
    (request) => request.requestStatus === "pending",
  ).length;

  const columns = useMemo<DataTableColumn<PreRegistration>[]>(
    () => [
      {
        header: "ประเภทคำขอ",
        accessor: (row) => row.requestType ?? (row.employee_code ? "update" : "register"),
        cell: ({ value }) => <span className="text-sm font-semibold text-brand-600">{value === "update" ? "แก้ไขข้อมูล" : "ลงทะเบียนใหม่"}</span>,
      },
      {
        header: "รหัส / ชื่อพนักงาน",
        accessor: (row) => row,
        cell: ({ row }) => (
          <div>
            <p className="font-mono text-xs font-bold text-brand-600">
              {row.employee_code }
            </p>
            <p className="mt-1 font-semibold text-heading">
              {row.first_name} {row.last_name}
            </p>
          </div>
        ),
      },
      {
        header: "บริษัท",
        accessor: "supplierName",
        cell: ({ value }) => (
          <span className="inline-flex items-center gap-2">
            <Building2 size={15} className="text-slate-400" />
            {String(value ?? "-")}
          </span>
        ),
      },
      {
        header: "แผนก / ตำแหน่ง",
        accessor: (row) => row,
        cell: ({ row }) => (
          <div>
            <p>{row.department || "-"}</p>
            <p className="text-xs text-muted">{row.position || "-"}</p>
          </div>
        ),
      },
      {
        header: "วันที่ส่ง",
        accessor: "submittedAt",
        cell: ({ value }) => (
          <span className="text-sm">
            {new Date(String(value)).toLocaleString("th-TH")}
          </span>
        ),
      },
      {
        header: "สถานะ",
        accessor: "requestStatus",
        cell: ({ row }) => {
          const styles = {
            pending: "bg-amber-50 text-amber-700",
            approved: "bg-success-50 text-success-600",
            rejected: "bg-danger-50 text-danger-700",
          }[row.requestStatus];

          return (
            <div>
              <span
                className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${styles}`}
              >
                {statusLabels[row.requestStatus]}
              </span>
              {row.rejectionReason && (
                <p className="mt-1 max-w-48 text-xs text-danger-600">
                  {row.rejectionReason}
                </p>
              )}
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
    <>
      {review && (
        <PreRegistrationReviewModal
          request={
            requests.find((request) => request.id === review.request.id) ??
            review.request
          }
          canReview={canReview}
          histories={visibleRequests.filter((request) => request.id === review.request.id || Boolean(review.request.employee_code && request.employee_code === review.request.employee_code)).flatMap(getRequestHistory)}
          onClose={() => setReview(null)}
          onApprove={approveRequest}
          onReject={rejectRequest}
        />
      )}
      <HeroCover
        size="small"
        image="/training-cover.jpg"
        imagePosition="center"
        eyebrow="Employee Registration"
        eyebrowIcon={ClipboardCheck}
        title="Pre-register"
        highlight="พนักงาน"
        description={
          canReview
            ? "ตรวจสอบและอนุมัติข้อมูลพนักงานที่ Supplier ส่งเข้ามา"
            : "ติดตามสถานะข้อมูลพนักงานที่บริษัทส่งให้ Admin ตรวจสอบ"
        }
      />

      <section className="relative z-10 -mt-10 px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Card className="mb-6 border-0 p-5 shadow-lg shadow-slate-900/5 sm:p-6">
            <PageTitle
              title={canReview ? "รายการรออนุมัติ" : "รายการที่ส่งตรวจสอบ"}
              subtitle={
                canReview
                  ? "อนุมัติแล้วรายการจะปรากฏในทะเบียนพนักงาน"
                  : "Admin จะตรวจสอบก่อนนำเข้าทะเบียนพนักงาน"
              }
            />

            <div className="mt-5 flex flex-wrap gap-3 border-t border-border pt-5">
              <div className="rounded-xl bg-amber-50 px-4 py-3">
                <p className="text-xs text-amber-700">รอตรวจสอบ</p>
                <p className="mt-1 text-xl font-bold text-amber-800">
                  {pendingCount}
                </p>
              </div>
              <div className="rounded-xl bg-slate-100 px-4 py-3">
                <p className="text-xs text-muted">รายการทั้งหมด</p>
                <p className="mt-1 text-xl font-bold text-heading">
                  {visibleRequests.length}
                </p>
              </div>
            </div>
          </Card>

          {visibleRequests.length === 0 ? (
            <Card className="py-14">
              <Empty>ยังไม่มีรายการ Pre-register</Empty>
            </Card>
          ) : (
            <Card className="overflow-hidden border-0 shadow-lg shadow-slate-900/5">
              <DataTable
                columns={columns}
                data={visibleRequests}
                rowKey="id"
                minWidth="980px"
                actions={(request) => (
                  <button type="button" title="ดูข้อมูลและประวัติคำขอ" aria-label={`ดูข้อมูล ${request.first_name} ${request.last_name}`}
                    onClick={() => setReview({ request })}
                    className="inline-flex items-center gap-2 rounded-control bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-700 hover:text-white">
                    <Eye size={18} /> 
                  </button>
                )}
              />
            </Card>
          )}

          <div className="mt-4 flex items-center gap-2 text-xs text-muted">
            <Clock3 size={14} />
            ข้อมูล Demo เก็บใน localStorage ของ Browser
          </div>
        </div>
      </section>
    </>
  );
}
