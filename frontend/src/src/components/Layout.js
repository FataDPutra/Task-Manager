import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaSignOutAlt, FaTimes, FaExclamationTriangle } from "react-icons/fa";
import { BiTask } from "react-icons/bi";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = async () => {
    await logout();
    navigate("/login");
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center min-w-0 flex-1">
              <Link
                to="/tasks"
                className="text-base sm:text-lg font-semibold text-gray-900 hover:text-blue-600 flex items-center gap-2"
              >
                <BiTask className="text-blue-600" />
                <span className="hidden xs:inline">Task Management System</span>
                <span className="xs:hidden">TMS</span>
              </Link>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {user && (
                <>
                  <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1 bg-gray-100 rounded">
                    <span className="text-[10px] sm:text-xs text-gray-500 leading-tight whitespace-nowrap">
                      Hello,
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-gray-900 leading-tight break-all">
                      {user.username || user.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogoutClick}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-medium py-1.5 px-3 rounded flex-shrink-0 flex items-center gap-1.5 transition-colors"
                  >
                    <FaSignOutAlt className="text-xs" />
                    <span className="hidden sm:inline">Keluar</span>
                    <span className="sm:hidden">Out</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pb-8">{children}</main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleLogoutCancel}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <FaExclamationTriangle className="text-red-600 text-xl" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Konfirmasi Logout
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Apakah Anda yakin ingin keluar dari akun ini?
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={handleLogoutCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleLogoutConfirm}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FaSignOutAlt />
                    <span>Keluar</span>
                  </button>
                </div>
              </div>
              <button
                onClick={handleLogoutCancel}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
