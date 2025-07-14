/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const base_url = import.meta.env.VITE_API_KEY_Base_URL;
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token"); // or from your auth context
  const admin_info = JSON.parse(localStorage.getItem("admin")); // or from your auth context

  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${base_url}/api/admin/admin-profile/${admin_info._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setAdminData(response.data.admin);
      } else {
        setError(response.data.message || "Admin not found");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
      console.error("Error fetching admin profile:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAdminProfile();
  }, []);
  const clearAdminData = () => {
    setAdminData(null);
    setError(null);
    setLoading(false);
  };

  return (
    <AdminContext.Provider
      value={{
        adminData,
        loading,
        error,
        fetchAdminProfile,
        clearAdminData,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
