import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiClock,
  FiTruck,
  FiBarChart2,
  FiSettings,
  FiX,
  FiPackage,
  FiBook,
  FiUser,
  FiChevronDown,
  FiChevronRight,
  FiLogOut,
  FiUsers,
  FiCalendar,
  FiLayers,
  FiTool,
  FiAlertTriangle,
} from "react-icons/fi";

type User = {
  name: string;
  email: string;
  avatar?: string;
  role: string;
};

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  user: User | null;
  onLogout: () => void;
}

type NavItem = {
  path: string;
  icon: React.ElementType;
  label: string;
  children?: NavItem[];
  roles?: string[];
};

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  user,
  onLogout,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    fleet: false,
    admin: false,
    reports: false,
  });

  const navItems: NavItem[] = [
    { path: "/dashboard", icon: FiHome, label: "Dashboard" },
    {
      path: "#admin",
      icon: FiTool,
      label: "Admin",
      roles: ["admin"],
      children: [
        {
          path: "/pending-approvals",
          icon: FiAlertTriangle,
          label: "Pending Approvals",
        },
        { path: "/users", icon: FiUsers, label: "User Management" },
      ],
    },
    {
      path: "#fleet",
      icon: FiTruck,
      label: "Fleet",
      children: [
        { path: "/vehicles", icon: FiTruck, label: "Vehicles" },
        { path: "/drivers", icon: FiUser, label: "Drivers" },
        { path: "/maintenance", icon: FiTool, label: "Maintenance" },
      ],
    },
    {
      path: "/bookings",
      icon: FiCalendar,
      label: "Bookings",
      children: [
        { path: "/bookings", icon: FiCalendar, label: "All Bookings" },
        { path: "/bookings/new", icon: FiCalendar, label: "New Booking" },
      ],
    },
    {
      path: "/packages",
      icon: FiPackage,
      label: "Packages",
      children: [
        { path: "/packages", icon: FiPackage, label: "All Packages" },
        { path: "/packages/new", icon: FiPackage, label: "Create Package" },
      ],
    },
    {
      path: "#reports",
      icon: FiBarChart2,
      label: "Reports",
      children: [
        { path: "/reports/sales", icon: FiBarChart2, label: "Sales" },
        {
          path: "/reports/vehicles",
          icon: FiTruck,
          label: "Vehicle Utilization",
        },
        { path: "/reports/drivers", icon: FiUser, label: "Driver Performance" },
      ],
    },
  ];

  const toggleExpand = (key: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const hasActiveChild = (items: NavItem[] = []): boolean => {
    return items.some(
      (item) =>
        isActive(item.path) || (item.children && hasActiveChild(item.children))
    );
  };

  const renderNavItem = (item: NavItem, depth = 0) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isItemActive = isActive(item.path);
    const isExpanded =
      expandedItems[item.path.replace(/^#/, "")] ||
      hasActiveChild(item.children);
    const isGroup = item.path.startsWith("#");

    // Skip rendering if user doesn't have required role
    if (item.roles && (!user || !item.roles.includes(user.role))) {
      return null;
    }

    const content = (
      <div
        className={`
          flex items-center justify-between w-full text-left
          ${depth > 0 ? "pl-4" : ""}
        `}
      >
        <div className="flex items-center space-x-3">
          <Icon
            className={`w-5 h-5 flex-shrink-0 ${
              isItemActive ? "text-primary-600" : "text-gray-500"
            }`}
          />
          <span
            className={`font-medium ${
              isItemActive ? "text-primary-700" : "text-gray-700"
            }`}
          >
            {item.label}
          </span>
        </div>
        {hasChildren && (
          <span className="text-gray-400">
            {isExpanded ? (
              <FiChevronDown size={16} />
            ) : (
              <FiChevronRight size={16} />
            )}
          </span>
        )}
      </div>
    );

    return (
      <div key={item.path} className="space-y-1">
        {isGroup ? (
          <button
            type="button"
            onClick={() => toggleExpand(item.path.replace(/^#/, ""))}
            className={`
              w-full px-4 py-3 rounded-lg transition-colors duration-200
              ${isItemActive ? "bg-primary-50 text-primary-700" : "text-gray-700 hover:bg-gray-50"}
            `}
          >
            {content}
          </button>
        ) : (
          <Link
            to={item.path}
            className={`
              block px-4 py-3 rounded-lg transition-colors duration-200
              ${isItemActive ? "bg-primary-50 text-primary-700" : "text-gray-700 hover:bg-gray-50"}
            `}
            onClick={() => window.innerWidth < 1024 && onToggle()}
          >
            {content}
          </Link>
        )}

        {hasChildren && isExpanded && (
          <div className="ml-4 mt-1 space-y-1">
            {item.children?.map((child) => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out
          flex flex-col w-64
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo & Brand */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TT</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Tours Admin
              </h1>
              <p className="text-xs text-gray-500">Management Portal</p>
            </div>
          </Link>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 -mr-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <FiX className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="px-2 space-y-1">
            {navItems.map((item) => renderNavItem(item))}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-medium text-sm">
                  {user?.name?.charAt(0) || "U"}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-600 transition-colors"
              aria-label="Logout"
              title="Logout"
            >
              <FiLogOut className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100">
            <Link
              to="/profile"
              className="block w-full text-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              onClick={() => window.innerWidth < 1024 && onToggle()}
            >
              View Profile
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};
