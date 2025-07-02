import React, { useState } from "react";
import Sidebar from "../../component/admin/sidebar";
import SubadminCreate from "./SubadminCreate";
import SubadminList from "./SubadminList";
import TeacherRegistration from "../teacher/teacherRegister";

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");

  const renderView = () => {
    switch (activeView) {
      case "subadminCreate":
        return <SubadminCreate />;
      case "subadminList":
        return <SubadminList />;
      case "TeacherRegistration":
        return <TeacherRegistration />;
      default:
        return <h1 className="p-6 text-xl font-bold">Dashboard Overview</h1>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 overflow-auto p-6">{renderView()}</main>
    </div>
  );
};

export default AdminDashboard;
