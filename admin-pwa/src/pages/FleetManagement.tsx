import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { FiTruck } from "react-icons/fi";
import { vehiclesApi } from "../services/api";
import { VehicleCard } from "../components/VehicleCard";
import { BlockDatesModal } from "../components/BlockDatesModal";
import toast from "react-hot-toast";

export const FleetManagement: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: vehicles, isLoading } = useQuery(
    "vehicles",
    vehiclesApi.getAllVehicles
  );

  const toggleMutation = useMutation(
    (vehicleId: string) => vehiclesApi.toggleAvailability(vehicleId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("vehicles");
        toast.success("Vehicle availability updated");
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.message || "Failed to update availability"
        );
      },
    }
  );

  const blockDatesMutation = useMutation(
    ({ vehicleId, data }: { vehicleId: string; data: any }) =>
      vehiclesApi.blockDates(vehicleId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("vehicles");
        setShowBlockModal(false);
        toast.success("Dates blocked successfully");
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to block dates");
      },
    }
  );

  const handleToggleAvailability = (vehicleId: string) => {
    toggleMutation.mutate(vehicleId);
  };

  const handleBlockDates = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setShowBlockModal(true);
  };

  const handleBlockDatesSubmit = (data: any) => {
    if (selectedVehicle) {
      blockDatesMutation.mutate({ vehicleId: selectedVehicle._id, data });
    }
  };

  const availableVehicles =
    vehicles?.filter((v: any) => v.status === "available").length || 0;
  const totalVehicles = vehicles?.length || 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="card">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="card">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Fleet Management
            </h2>
            <p className="text-gray-600">
              {availableVehicles} of {totalVehicles} vehicles available
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <FiTruck className="w-6 h-6 text-primary-600" />
            <span className="text-sm font-medium text-primary-600">
              Live Status
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">
            {availableVehicles}
          </div>
          <div className="text-sm text-gray-600">Available</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-600">
            {totalVehicles - availableVehicles}
          </div>
          <div className="text-sm text-gray-600">Unavailable</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">
            {Math.round((availableVehicles / totalVehicles) * 100)}%
          </div>
          <div className="text-sm text-gray-600">Utilization</div>
        </div>
      </div>

      {/* Vehicle Types Summary */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-3">Vehicle Types</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            "Sedan",
            "SUV",
            "7-Seater",
            "Tempo Traveller",
            "Minibus",
            "Bus",
          ].map((type) => {
            const count =
              vehicles?.filter((v: any) => v.type === type).length || 0;
            const available =
              vehicles?.filter(
                (v: any) => v.type === type && v.status === "available"
              ).length || 0;

            return (
              <div
                key={type}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <span className="text-sm font-medium text-gray-900">
                  {type}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-green-600">{available}</span>
                  <span className="text-sm text-gray-500">/</span>
                  <span className="text-sm text-gray-600">{count}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vehicles List */}
      <div className="space-y-3">
        {vehicles?.length === 0 ? (
          <div className="card text-center py-12">
            <FiTruck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Vehicles Found
            </h3>
            <p className="text-gray-600">
              Add vehicles to start managing your fleet
            </p>
          </div>
        ) : (
          vehicles?.map((vehicle: any) => (
            <VehicleCard
              key={vehicle._id}
              vehicle={vehicle}
              onToggleAvailability={() => handleToggleAvailability(vehicle._id)}
              onBlockDates={() => handleBlockDates(vehicle)}
              isToggling={toggleMutation.isLoading}
            />
          ))
        )}
      </div>

      {/* Block Dates Modal */}
      {showBlockModal && selectedVehicle && (
        <BlockDatesModal
          vehicle={selectedVehicle}
          onClose={() => setShowBlockModal(false)}
          onSubmit={handleBlockDatesSubmit}
          isLoading={blockDatesMutation.isLoading}
        />
      )}
    </div>
  );
};
