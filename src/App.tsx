import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import { Loading } from "./components/Ui";
import {
  AuthProvider,
  HomeRedirect,
  ProtectedRoute,
} from "./auth/AuthContext";
import { PreRegistrationProvider } from "./auth/PreRegistrationContext";

const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const Courses = lazy(() => import("./pages/courses/Courses"));
const Attendance = lazy(() => import("./pages/Attendance"));
const Employees = lazy(() => import("./pages/employees/Employees"));
const PreRegistrations = lazy(
  () => import("./pages/employees/PreRegistrations"),
);
const Login = lazy(() => import("./pages/Login"));
const Settings = lazy(() => import("./pages/settings/Settings"));

export default function App() {
  return (
    <AuthProvider>
      <PreRegistrationProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
          <Route path="/" element={<HomeRedirect />} />

          <Route path="/login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute permissions={["dashboard.view"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <ProtectedRoute permissions={["courses.view"]}>
                  <Courses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:id/attendance"
              element={
                <ProtectedRoute permissions={["attendance.view"]}>
                  <Attendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees"
              element={
                <ProtectedRoute
                  permissions={[
                    "employees.view_all",
                    "employees.view_company",
                  ]}
                >
                  <Employees />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pre-registrations"
              element={
                <ProtectedRoute
                  permissions={[
                    "preregistration.view_own",
                    "preregistration.review",
                  ]}
                >
                  <PreRegistrations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute permissions={["settings.view"]}>
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Route>

            <Route path="*" element={<HomeRedirect />} />
          </Routes>
        </Suspense>
      </PreRegistrationProvider>
    </AuthProvider>
  );
}
