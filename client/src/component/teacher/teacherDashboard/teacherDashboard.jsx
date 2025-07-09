import React, { useState } from "react";
import Sidebar from "./sidebar";
import TeacherSettings from "./settings";

const TeacherDashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const renderView = () => {
    switch (activeView) {
      case "settings":
        return <TeacherSettings />;
      default:
        return <h1 className="p-6 text-xl font-bold">Dashboard Overview</h1>;
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-300 min-h-screen flex items-center justify-center p-4">
      <div className="flex w-full max-w-7xl h-[95vh] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Sidebar Section */}
        <Sidebar activeView={activeView} setActiveView={setActiveView} />

        {/* Main Content Section */}
        <div className="flex-1 h-full overflow-auto p-6">{renderView()}</div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
