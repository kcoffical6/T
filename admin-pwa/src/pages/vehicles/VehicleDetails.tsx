import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch } from "../../store/store";
import { RootState } from "../../store/reducer";
import { fetchVehicleById } from "../../features/vehicles/vehicleSlice";
import { Link } from "react-router-dom";

const VehicleDetails: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { currentVehicle, status, error } = useSelector(
    (state: RootState) => state.vehicles
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchVehicleById(id));
    }
  }, [id, dispatch]);

  if (status === "loading") {
    return <div>Loading vehicle details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!currentVehicle) {
    return <div>Vehicle not found</div>;
  }

  const {
    make,
    model,
    year,
    type,
    seatingCapacity,
    basePricePerDay,
    features = [],
    description,
    images = [],
    driver,
    isAvailable,
  } = currentVehicle;

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center"
      >
        ← Back to Vehicles
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Image Gallery */}
        {images && images.length > 0 && (
          <div className="h-64 md:h-96 bg-gray-200 flex items-center justify-center">
            <img
              src={images[0]}
              alt={`${make} ${model}`}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        )}

        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">
                {year} {make} {model}
              </h1>
              <div className="flex items-center mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isAvailable
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {isAvailable ? "Available" : "Not Available"}
                </span>
                <span className="ml-2 text-gray-600">
                  {type} • {seatingCapacity} Seats
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                ${basePricePerDay}{" "}
                <span className="text-base font-normal text-gray-500">
                  / day
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">
              {description || "No description available."}
            </p>
          </div>

          {features && features.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Features</h2>
              <div className="flex flex-wrap gap-2">
                {features.map((feature: string, index: number) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {driver && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Driver Information</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{driver.name}</p>
                <p className="text-gray-600">Mobile: {driver.mobile}</p>
                <p className="text-gray-600">
                  Experience: {driver.experience} years
                </p>
                <p className="text-gray-600">License: {driver.licenseNumber}</p>
                {driver.description && (
                  <p className="mt-2 text-gray-700">{driver.description}</p>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 flex space-x-4">
            <Link
              to={`/vehicles/${id}/edit`}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Edit Vehicle
            </Link>
            <button
              onClick={() => navigate(-1)}
              className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
            >
              Back to List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
