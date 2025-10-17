import React from "react";
import { useQuery } from "react-query";
import {
  FiBarChart2,
  FiTrendingUp,
  FiUsers,
  FiTruck,
  FiClock,
} from "react-icons/fi";
import { reportsApi } from "../services/api";

export const Dashboard: React.FC = () => {
  const { data: revenueData } = useQuery("revenueReport", () =>
    reportsApi.getRevenueReport({ period: "30d" })
  );

  const { data: commissionData } = useQuery("commissionReport", () =>
    reportsApi.getCommissionReport({ period: "30d" })
  );

  const { data: occupancyData } = useQuery("occupancyReport", () =>
    reportsApi.getOccupancyReport({ period: "30d" })
  );

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${revenueData?.totalRevenue?.toLocaleString() || "0"}`,
      change: `+${revenueData?.growth || 0}%`,
      icon: FiTrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Commission Earned",
      value: `₹${commissionData?.totalCommission?.toLocaleString() || "0"}`,
      change: `+${commissionData?.growth || 0}%`,
      icon: FiBarChart2,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Bookings",
      value: occupancyData?.activeBookings || "0",
      change: `${occupancyData?.occupancyRate || 0}% occupancy`,
      icon: FiUsers,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Fleet Utilization",
      value: `${occupancyData?.fleetUtilization || 0}%`,
      change: `${occupancyData?.availableVehicles || 0} available`,
      icon: FiTruck,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your tour operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-sm text-gray-500">{stat.change}</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.title}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <button className="p-4 bg-primary-50 rounded-lg text-left hover:bg-primary-100 transition-colors">
            <FiClock className="w-6 h-6 text-primary-600 mb-2" />
            <div className="font-medium text-primary-900">
              Pending Approvals
            </div>
            <div className="text-sm text-primary-700">Review new bookings</div>
          </button>

          <button className="p-4 bg-green-50 rounded-lg text-left hover:bg-green-100 transition-colors">
            <FiTruck className="w-6 h-6 text-green-600 mb-2" />
            <div className="font-medium text-green-900">Fleet Status</div>
            <div className="text-sm text-green-700">Manage vehicles</div>
          </button>

          <button className="p-4 bg-blue-50 rounded-lg text-left hover:bg-blue-100 transition-colors">
            <FiBarChart2 className="w-6 h-6 text-blue-600 mb-2" />
            <div className="font-medium text-blue-900">Reports</div>
            <div className="text-sm text-blue-700">View analytics</div>
          </button>

          <button className="p-4 bg-purple-50 rounded-lg text-left hover:bg-purple-100 transition-colors">
            <FiUsers className="w-6 h-6 text-purple-600 mb-2" />
            <div className="font-medium text-purple-900">All Bookings</div>
            <div className="text-sm text-purple-700">Manage reservations</div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                Booking Approved
              </div>
              <div className="text-xs text-gray-600">
                Kerala Backwaters Tour • 2 min ago
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                Vehicle Status Updated
              </div>
              <div className="text-xs text-gray-600">
                SUV-001 marked as available • 5 min ago
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                New Booking Request
              </div>
              <div className="text-xs text-gray-600">
                Tamil Nadu Temple Circuit • 10 min ago
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
