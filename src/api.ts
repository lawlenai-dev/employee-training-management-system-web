const API_URL = import.meta.env.VITE_API_URL || "/api";

export type ApiResponse<T> = {
  data: T;
  message?: string;
};

type ApiErrorBody = {
  message?: string;
  errors?: unknown;
};

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export type CourseApiRecord = {
  id: string | number;
  title: string;
  description?: string;
  course_date: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  instructor?: string;
  status?: string;
};

export type AttendanceApiRecord = {
  id: string | number;
  full_name: string;
  employee_code: string;
  department?: string;
  checked_in_at: string;
  checkin_method: "qr" | "manual" | string;
};

export type EmployeeApiRecord = {
  id: string | number;
  employee_code: string;
  first_name?: string;
  last_name?: string;
  department?: string;
  position?: string;
  qr_token?: string;
  is_active?: boolean | number | string;
};

export async function api<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type"))
    headers.set("Content-Type", "application/json");
  if (!headers.has("Accept")) headers.set("Accept", "application/json");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = (await response.json().catch(() => ({}))) as T & ApiErrorBody;
  if (!response.ok) {
    throw new ApiError(
      data.message || "เกิดข้อผิดพลาดจากระบบ",
      response.status,
      data.errors,
    );
  }
  return data;
}

export const getCourses = () => api<ApiResponse<CourseApiRecord[]>>("/courses");

export const getCourse = (id: string | number) =>
  api<ApiResponse<CourseApiRecord>>(`/courses/${id}`);

export const createCourse = <T extends object>(payload: T) =>
  api<ApiResponse<CourseApiRecord>>("/courses", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getAttendance = (id: string | number) =>
  api<ApiResponse<AttendanceApiRecord[]>>(`/courses/${id}/attendance`);

export const checkIn = (
  id: string | number,
  payload: { credential: string; checkin_method: "qr" | "manual" },
) =>
  api<ApiResponse<{ employee: { full_name: string } }>>(
    `/courses/${id}/attendance`,
    { method: "POST", body: JSON.stringify(payload) },
  );

export const getEmployees = (search = "") =>
  api<ApiResponse<EmployeeApiRecord[]>>(
    `/employees?search=${encodeURIComponent(search)}`,
  );

export const createEmployee = <T extends object>(payload: T) =>
  api<ApiResponse<EmployeeApiRecord>>("/employees", {
    method: "POST",
    body: JSON.stringify(payload),
  });
