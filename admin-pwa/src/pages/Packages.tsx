import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { packagesApi } from "../services/api";
import {
  FiEdit,
  FiTrash2,
  FiEye,
  FiPlus,
  FiToggleLeft,
  FiToggleRight,
  FiImage,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAppSelector } from "../store/store";

interface Package {
  _id: string;
  title: string;
  region: string;
  basePricePerPax: number;
  isActive: boolean;
  images?: string[];
  tags: string[];
}

export const Packages: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/login";
    }
  }, [isAuthenticated]);

  // Fetch packages with proper error handling
  const {
    data: packages = [],
    isLoading,
    isError,
    error,
  } = useQuery<Package[]>({
    queryKey: ["packages"],
    queryFn: async () => {
      const data = await packagesApi.getAllPackages();
      return Array.isArray(data) ? data : [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Toggle package status
  const { mutate: toggleStatus } = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      packagesApi.togglePackageStatus(id, !isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
    onError: (error) => {
      console.error("Error toggling package status:", error);
    },
  });

  // Delete package
  const { mutate: deletePkg } = useMutation({
    mutationFn: (id: string) => packagesApi.deletePackage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
    onError: (error) => {
      console.error("Error deleting package:", error);
    },
  });

  // Filter packages based on search term
  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pkg.tags || []).some((tag: string) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FiLoader className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-red-600 flex items-center">
        <FiAlertCircle className="mr-2" />
        Error loading packages:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Tour Packages</h1>
        <Link
          to="/packages/new"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="mr-2" /> Add New Package
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search packages by title, region, or tags..."
            className="w-full md:w-1/3 p-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Region
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPackages.length > 0 ? (
                filteredPackages.map((pkg) => (
                  <tr
                    key={pkg._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                          {pkg.images?.[0] ? (
                            <img
                              className="h-full w-full object-cover"
                              src={`/uploads/${pkg.images[0]}`}
                              alt={pkg.title}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = "https://via.placeholder.com/48";
                              }}
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                              <FiImage className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {pkg.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {(pkg.tags || []).map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-1 mb-1"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{pkg.region}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        ₹{pkg.basePricePerPax?.toLocaleString("en-IN")}
                      </div>
                      <div className="text-xs text-gray-500">per person</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() =>
                          toggleStatus({ id: pkg._id, isActive: pkg.isActive })
                        }
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          pkg.isActive
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        } transition-colors`}
                      >
                        {pkg.isActive ? (
                          <>
                            <FiToggleRight className="mr-1.5" /> Active
                          </>
                        ) : (
                          <>
                            <FiToggleLeft className="mr-1.5" /> Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/packages/${pkg._id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="View details"
                        >
                          <FiEye className="h-5 w-5" />
                        </Link>
                        <Link
                          to={`/packages/edit/${pkg._id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <FiEdit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this package?"
                              )
                            ) {
                              deletePkg(pkg._id);
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <FiAlertCircle className="h-12 w-12 text-gray-300 mb-2" />
                      <p className="text-lg font-medium">No packages found</p>
                      <p className="text-sm">
                        {searchTerm
                          ? "Try adjusting your search"
                          : "Create your first package to get started"}
                      </p>
                      {!searchTerm && (
                        <Link
                          to="/packages/new"
                          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                          Add Package
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Packages;
