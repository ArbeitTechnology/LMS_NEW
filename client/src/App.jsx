import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AdminLogin from "./component/admin/adminLogin";
import ForgotPassword from "./component/admin/ForgotPassword";
import ResetPassword from "./component/admin/ResetPassword";
import AdminDashboard from "./component/admin/adminDashboard/adminDashboard";
import TeacherAuth from "./component/teacher/teacherAuth";
import StudentAuth from "./component/student/studentAuth";

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

const getUserRole = () => {
  return localStorage.getItem("role"); // "admin" or "subadmin"
};

const App = () => {
  const role = getUserRole();

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/admin" element={<AdminLogin />} />

        <Route path="/admin/forgotPassword" element={<ForgotPassword />} />
        <Route path="/admin/reset-password" element={<ResetPassword />} />

        <Route
          path="/admin/dashboard"
          element={
            isAuthenticated() ? (
              role === "admin" ? (
                <AdminDashboard />
              ) : role === "subadmin" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/admin" replace />
              )
            ) : (
              <Navigate to="/admin" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/admin" replace />} />
        <Route path="/teacher" element={<TeacherAuth />} />
        <Route path="/student" element={<StudentAuth />} />
      </Routes>
    </>
  );
};

export default App;
