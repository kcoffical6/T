import React from "react";
import { useQuery } from "react-query";
import {
  FiBarChart2,
  FiTrendingUp,
  FiUsers,
  FiTruck,
  FiClock,
  FiPlus,
  FiDollarSign,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { reportsApi } from "../services/api";
import { useSelector } from "react-redux";
import { RootState } from "@/store/reducer";
import { log } from "console";

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
  const state = useSelector((state: RootState) => state);
  console.log("state", state);

  // Mock data for recent vehicles (replace with actual API call)
  const recentVehicles = [
    {
      id: 1,
      make: "Toyota",
      model: "Innova Crysta",
      type: "SUV",
      status: "available",
      added: "2 hours ago",
    },
    {
      id: 2,
      make: "Maruti",
      model: "Ertiga",
      type: "MUV",
      status: "in-service",
      added: "5 hours ago",
    },
    {
      id: 3,
      make: "Honda",
      model: "City",
      type: "Sedan",
      status: "available",
      added: "1 day ago",
    },
  ];

  // Vehicle stats
  const vehicleStats = {
    totalVehicles: 24,
    available: 18,
    inService: 4,
    booked: 2,
    utilization: 75,
  };

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${revenueData?.totalRevenue?.toLocaleString() || "0"}`,
      change: `+${revenueData?.growth || 0}% from last month`,
      icon: FiTrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Fleet Size",
      value: vehicleStats.totalVehicles,
      change: `${vehicleStats.available} available, ${vehicleStats.inService} in service`,
      icon: FiTruck,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Fleet Utilization",
      value: `${vehicleStats.utilization}%`,
      change: `${vehicleStats.booked} vehicles currently booked`,
      icon: FiBarChart2,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Average Daily Rate",
      value: `₹4,200`,
      change: `+5.2% from last month`,
      icon: FiDollarSign,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          <Link
            to="/vehicles/new"
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FiPlus className="mr-1.5 h-4 w-4" />
            Add Vehicle
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/vehicles"
            className="p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <FiTruck className="w-5 h-5" />
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-gray-900">Manage Fleet</h3>
                <p className="text-sm text-gray-500">
                  View and manage all vehicles
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/bookings"
            className="p-4 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                <FiUsers className="w-5 h-5" />
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-gray-900">Bookings</h3>
                <p className="text-sm text-gray-500">Manage reservations</p>
              </div>
            </div>
          </Link>

          <Link
            to="/reports"
            className="p-4 bg-white border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-50 text-green-600">
                <FiBarChart2 className="w-5 h-5" />
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-gray-900">Reports</h3>
                <p className="text-sm text-gray-500">
                  View analytics & insights
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/drivers"
            className="p-4 bg-white border border-gray-200 rounded-lg hover:border-amber-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                <FiUsers className="w-5 h-5" />
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-gray-900">Drivers</h3>
                <p className="text-sm text-gray-500">
                  Manage drivers & assignments
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Vehicles */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Vehicles
            </h2>
            <Link
              to="/vehicles"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <FiTruck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {vehicle.make} {vehicle.model}
                    </div>
                    <div className="text-sm text-gray-500">{vehicle.type}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  {vehicle.status === "available" ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <FiCheckCircle className="mr-1 h-3 w-3" />
                      Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <FiAlertCircle className="mr-1 h-3 w-3" />
                      In Service
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h2>
            <button className="text-sm font-medium text-gray-500 hover:text-gray-700">
              View All
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-white border border-gray-100 rounded-lg">
              <div className="w-2 h-2 mt-2 bg-green-500 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  New Vehicle Added
                </div>
                <p className="text-sm text-gray-600">
                  Toyota Innova Crysta has been added to the fleet
                </p>
                <div className="mt-1 text-xs text-gray-500">2 hours ago</div>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-white border border-gray-100 rounded-lg">
              <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  Vehicle Status Updated
                </div>
                <p className="text-sm text-gray-600">
                  SUV-001 has been marked as available after maintenance
                </p>
                <div className="mt-1 text-xs text-gray-500">5 hours ago</div>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-white border border-gray-100 rounded-lg">
              <div className="w-2 h-2 mt-2 bg-purple-500 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  New Driver Assigned
                </div>
                <p className="text-sm text-gray-600">
                  Rajesh Kumar assigned to Toyota Innova Crysta (KA-01-AB-1234)
                </p>
                <div className="mt-1 text-xs text-gray-500">1 day ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
