/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/superadmin/Promote.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  RefreshCw,
  Sun,
  Moon,
  Bell,
  User,
  Mail,
  Calendar,
  Crown,
  UserPlus,
  UserMinus,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  X,
} from "lucide-react";
import superadminApi from "../../../services/superadminApi";
import SuperAdminProfile from "./SuperAdmin";
import AdminBottomNav from "../Components/AdminBottomNav";
import { useDarkMode } from "../../../hooks/useDarkMode";
import AdminAlertBell from "../Notification/AdminAlertBell";

const Promote = () => {
  const navigate = useNavigate();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [processing, setProcessing] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const usersRes = await superadminApi.getAllUsers();
      const adminsRes = await superadminApi.getAllAdmins();
      
      setUsers(usersRes.users || []);
      setAdmins(adminsRes.admins || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      addToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePromote = async (userId) => {
    try {
      setProcessing(true);
      await superadminApi.promoteUser(userId);
      await fetchData();
      addToast("User promoted to admin successfully", "success");
    } catch (error) {
      addToast(error.message || "Failed to promote user", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleDemote = async (userId) => {
    try {
      setProcessing(true);
      await superadminApi.demoteAdmin(userId);
      await fetchData();
      addToast("Admin demoted to user successfully", "success");
    } catch (error) {
      addToast(error.message || "Failed to demote admin", "error");
    } finally {
      setProcessing(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.role === 'user' && 
    (user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredAdmins = admins.filter(admin => 
    admin.role === 'admin' &&
    (admin.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     admin.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     admin.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const Toast = ({ toasts, removeToast }) => (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all duration-300 max-w-sm
            ${toast.type === "success" ? "bg-green-600" : ""}
            ${toast.type === "error" ? "bg-red-600" : ""}
            ${toast.type === "info" ? "bg-blue-600" : ""}
            ${toast.type === "warning" ? "bg-orange-500" : ""}
          `}
        >
          {toast.type === "success" && <CheckCircle size={16} />}
          {toast.type === "error" && <XCircle size={16} />}
          {toast.type === "info" && <AlertCircle size={16} />}
          {toast.type === "warning" && <AlertCircle size={16} />}
          <span className="flex-1">{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="flex-shrink-0 hover:opacity-70">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <RefreshCw size={40} className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div >
      <Toast toasts={toasts} removeToast={removeToast} />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden pb-20">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-2 sm:mr-4 flex-shrink-0"
              >
                <ArrowLeft size={20} className="dark:text-white"/>
              </button>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate flex-1 ml-5">
                Admin Management
              </h1>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {darkMode ? <Sun size={18} className="dark:text-white"/> : <Moon size={18} />}
                </button>
                 <AdminAlertBell />
                <SuperAdminProfile />
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
            <nav className="flex gap-4 sm:gap-6 min-w-max px-1">
              <button
                onClick={() => setActiveTab("users")}
                className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === "users"
                    ? "border-blue-600 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Promote Users ({filteredUsers.length})
              </button>
              <button
                onClick={() => setActiveTab("admins")}
                className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === "admins"
                    ? "border-blue-600 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Manage Admins ({filteredAdmins.length})
              </button>
            </nav>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={`Search ${activeTab === "users" ? "users" : "admins"}...`}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Users/Admins List - Card View for Mobile, Table for Desktop */}
          {activeTab === "users" ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Mobile View (Card Layout) */}
              <div className="block sm:hidden divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <User size={40} className="mx-auto mb-3 opacity-50" />
                    <p>No users found</p>
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <div key={user._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 text-sm font-medium">
                              {user.firstName?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handlePromote(user._id)}
                          disabled={processing}
                          className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-xs font-medium flex items-center gap-1 flex-shrink-0"
                        >
                          <UserPlus size={14} />
                          <span className="hidden xs:inline">Promote</span>
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Mail size={12} />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <Calendar size={12} />
                        <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop View (Table) */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700/60">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                          <User size={40} className="mx-auto mb-3 opacity-50" />
                          <p>No users found</p>
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-blue-600 text-sm font-medium">
                                  {user.firstName?.charAt(0) || 'U'}
                                </span>
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[150px]">
                                {user.firstName} {user.lastName}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-[200px]">
                            {user.email}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handlePromote(user._id)}
                              disabled={processing}
                              className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-xs font-medium flex items-center gap-1 ml-auto"
                            >
                              <UserPlus size={14} />
                              Promote
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Mobile View (Card Layout) */}
              <div className="block sm:hidden divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAdmins.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Shield size={40} className="mx-auto mb-3 opacity-50" />
                    <p>No admins found</p>
                  </div>
                ) : (
                  filteredAdmins.map((admin) => (
                    <div key={admin._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-green-600 text-sm font-medium">
                              {admin.firstName?.charAt(0) || 'A'}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {admin.firstName} {admin.lastName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{admin.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDemote(admin._id)}
                          disabled={processing}
                          className="px-3 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-xs font-medium flex items-center gap-1 flex-shrink-0"
                        >
                          <UserMinus size={14} />
                          <span className="hidden xs:inline">Demote</span>
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Mail size={12} />
                        <span className="truncate">{admin.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <Calendar size={12} />
                        <span>Joined {new Date(admin.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop View (Table) */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700/60">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredAdmins.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                          <Shield size={40} className="mx-auto mb-3 opacity-50" />
                          <p>No admins found</p>
                        </td>
                      </tr>
                    ) : (
                      filteredAdmins.map((admin) => (
                        <tr key={admin._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-green-600 text-sm font-medium">
                                  {admin.firstName?.charAt(0) || 'A'}
                                </span>
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[150px]">
                                {admin.firstName} {admin.lastName}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-[200px]">
                            {admin.email}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                            {new Date(admin.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handleDemote(admin._id)}
                              disabled={processing}
                              className="px-3 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-xs font-medium flex items-center gap-1 ml-auto"
                            >
                              <UserMinus size={14} />
                              Demote
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <AdminBottomNav />
      </div>
    </div>
  );
};

export default Promote;