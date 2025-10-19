import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch } from "../../store/store";
import { RootState } from "../../store/reducer";
import {
  fetchVehicleById,
  createNewVehicle,
  updateExistingVehicle,
  clearCurrentVehicle,
} from "../../features/vehicles/vehicleSlice";
import { toast } from "react-toastify";
import VehicleForm from "../../components/VehicleForm";
import { IVehicle } from "../../services/vehicleApi";

const VehicleFormPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);

  const { currentVehicle, status, error } = useSelector(
    (state: RootState) => state.vehicles
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchVehicleById(id));
    } else {
      dispatch(clearCurrentVehicle());
    }

    return () => {
      dispatch(clearCurrentVehicle());
    };
  }, [id, dispatch]);

  const handleSubmit = async (
    vehicleData: Omit<IVehicle, "_id" | "createdAt" | "updatedAt">
  ) => {
    try {
      setIsLoading(true);
      if (isEditMode && id) {
        await dispatch(
          updateExistingVehicle({ id, data: vehicleData })
        ).unwrap();
        toast.success("Vehicle updated successfully");
      } else {
        await dispatch(createNewVehicle(vehicleData)).unwrap();
        toast.success("Vehicle created successfully");
      }
      navigate("/vehicles");
    } catch (error) {
      toast.error(error as string);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditMode && status === "loading") {
    return <div>Loading vehicle data...</div>;
  }

  if (isEditMode && error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? "Edit Vehicle" : "Add New Vehicle"}
      </h1>
      <VehicleForm
        isLoading={isLoading}
        vehicle={currentVehicle} // Changed from initialValues to vehicle
        onSubmit={handleSubmit}
        isEditMode={isEditMode}
      />
    </div>
  );
};

export default VehicleFormPage;
