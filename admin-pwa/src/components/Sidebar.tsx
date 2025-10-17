import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiClock,
  FiTruck,
  FiBarChart2,
  FiSettings,
  FiX,
} from "react-icons/fi";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", icon: FiHome, label: "Dashboard" },
    { path: "/pending", icon: FiClock, label: "Pending Approvals" },
    { path: "/fleet", icon: FiTruck, label: "Fleet Management" },
    { path: "/reports", icon: FiBarChart2, label: "Reports" },
    { path: "/settings", icon: FiSettings, label: "Settings" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:z-auto
        w-64
      `}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">XYZ</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Admin Portal
              </h1>
              <p className="text-sm text-gray-500">Tours & Travels</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200
                  ${
                    isActive
                      ? "bg-primary-50 text-primary-700 border-r-2 border-primary-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
                onClick={() => {
                  // Close sidebar on mobile after navigation
                  if (window.innerWidth < 1024) {
                    onToggle();
                  }
                }}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-primary-600" : "text-gray-500"}`}
                />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium text-sm">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Admin User
              </p>
              <p className="text-xs text-gray-500 truncate">
                admin@xyztours.com
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
