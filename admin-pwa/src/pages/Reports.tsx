import React, { useState } from "react";
import { useQuery } from "react-query";
import { FiDownload, FiCalendar, FiFilter } from "react-icons/fi";
import { reportsApi } from "../services/api";

export const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedReport, setSelectedReport] = useState("revenue");

  const { data: revenueData, isLoading: revenueLoading } = useQuery(
    ["revenueReport", selectedPeriod],
    () => reportsApi.getRevenueReport({ period: selectedPeriod })
  );

  const { data: commissionData, isLoading: commissionLoading } = useQuery(
    ["commissionReport", selectedPeriod],
    () => reportsApi.getCommissionReport({ period: selectedPeriod })
  );

  const { data: occupancyData, isLoading: occupancyLoading } = useQuery(
    ["occupancyReport", selectedPeriod],
    () => reportsApi.getOccupancyReport({ period: selectedPeriod })
  );

  const handleExport = async () => {
    try {
      const blob = await reportsApi.exportBookings({ period: selectedPeriod });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bookings-${selectedPeriod}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const periods = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
    { value: "1y", label: "Last year" },
  ];

  const reports = [
    { value: "revenue", label: "Revenue Report" },
    { value: "commission", label: "Commission Report" },
    { value: "occupancy", label: "Occupancy Report" },
  ];

  const isLoading = revenueLoading || commissionLoading || occupancyLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Reports & Analytics
            </h1>
            <p className="text-gray-600">
              Track performance and generate insights
            </p>
          </div>
          <button
            onClick={handleExport}
            className="btn-primary flex items-center space-x-2"
          >
            <FiDownload className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiCalendar className="w-4 h-4 inline mr-1" />
              Time Period
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {periods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiFilter className="w-4 h-4 inline mr-1" />
              Report Type
            </label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {reports.map((report) => (
                <option key={report.value} value={report.value}>
                  {report.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Revenue Report */}
      {selectedReport === "revenue" && (
        <div className="space-y-4">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Revenue Overview
            </h2>
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    ₹{revenueData?.totalRevenue?.toLocaleString() || "0"}
                  </div>
                  <div className="text-sm text-green-700">Total Revenue</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    ₹{revenueData?.averageBooking?.toLocaleString() || "0"}
                  </div>
                  <div className="text-sm text-blue-700">Avg Booking Value</div>
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3">
              Top Performing Packages
            </h3>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {revenueData?.topPackages?.map((pkg: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-gray-900">
                        {pkg.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {pkg.bookings} bookings
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        ₹{pkg.revenue?.toLocaleString()}
                      </div>
                      <div className="text-sm text-green-600">
                        +{pkg.growth}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Commission Report */}
      {selectedReport === "commission" && (
        <div className="space-y-4">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Commission Overview
            </h2>
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    ₹{commissionData?.totalCommission?.toLocaleString() || "0"}
                  </div>
                  <div className="text-sm text-purple-700">
                    Total Commission
                  </div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {commissionData?.averageRate || 0}%
                  </div>
                  <div className="text-sm text-orange-700">
                    Avg Commission Rate
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Occupancy Report */}
      {selectedReport === "occupancy" && (
        <div className="space-y-4">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Occupancy Overview
            </h2>
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {occupancyData?.occupancyRate || 0}%
                  </div>
                  <div className="text-sm text-blue-700">Occupancy Rate</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {occupancyData?.fleetUtilization || 0}%
                  </div>
                  <div className="text-sm text-green-700">
                    Fleet Utilization
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
