import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AdminLogin from "./component/admin/adminLogin";
import ForgotPassword from "./component/admin/ForgotPassword";
import ResetPassword from "./component/admin/ResetPassword";
import AdminDashboard from "./component/admin/adminDashboard/adminDashboard";
import TeacherAuth from "./component/teacher/teacherAuth";
import StudentAuth from "./component/student/studentAuth";
import ResetPasswordTeacher from "./component/teacher/ResetPassword";
import ForgotPasswordTeacher from "./component/teacher/ForgotPassword";
import ForgotPasswordStudent from "./component/student/ForgotPassword";
import ResetPasswordStudent from "./component/student/ResetPassword";
import StudentDashboard from "./component/student/studentDashboard/studentDashboard";
import TeacherDashboard from "./component/teacher/teacherDashboard/teacherDashboard";

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

const getUserRole = () => {
  return localStorage.getItem("role"); // "admin" or "subadmin"
};

const App = () => {
  const role = getUserRole();
  const [authMode, setAuthMode] = useState("register");
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/admin" element={<AdminLogin />} />

        <Route path="/admin/forgotPassword" element={<ForgotPassword />} />
        <Route path="/admin/reset-password" element={<ResetPassword />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* <Route path="*" element={<Navigate to="/admin" replace />} /> */}
        {/* Teacher route */}
        <Route
          path="/teacher"
          element={
            <TeacherAuth authMode={authMode} setAuthMode={setAuthMode} />
          }
        />
        <Route
          path="/teacher/forgotPassword"
          element={<ForgotPasswordTeacher setAuthMode={setAuthMode} />}
        />
        <Route
          path="/teacher/reset-password"
          element={<ResetPasswordTeacher />}
        />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        {/* Student route */}
        <Route
          path="/student"
          element={
            <StudentAuth authMode={authMode} setAuthMode={setAuthMode} />
          }
        />
        <Route
          path="/student/forgotPassword"
          element={<ForgotPasswordStudent setAuthMode={setAuthMode} />}
        />
        <Route
          path="/student/reset-password"
          element={<ResetPasswordStudent />}
        />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
      </Routes>
    </>
  );
};

export default App;
