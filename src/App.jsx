import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import { Loading } from "./components/Ui";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Courses = lazy(() => import("./pages/courses/Courses"));
const Attendance = lazy(() => import("./pages/Attendance"));
const Employees = lazy(() => import("./pages/employees/Employees"));
const Login = lazy(() => import("./pages/Login"));
const Settings = lazy(() => import("./pages/settings/Settings"));

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id/attendance" element={<Attendance />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}
