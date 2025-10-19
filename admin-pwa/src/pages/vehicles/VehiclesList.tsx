import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { fetchVehicles } from "../../features/vehicles/vehicleSlice";
import { Link } from "react-router-dom";
import { RootState } from "../../store/reducer";

const VehiclesList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { vehicles, status } = useSelector(
    (state: RootState) => state.vehicles
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchVehicles());
    }
  }, [status, dispatch]);

  if (status === "loading") {
    return <div>Loading vehicles...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vehicle Management</h1>
        <Link
          to="/vehicles/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Vehicle
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle: any) => (
          <div
            key={vehicle._id}
            className="border rounded-lg overflow-hidden shadow-md"
          >
            {vehicle.images && vehicle.images.length > 0 && (
              <img
                src={vehicle.images[0]}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h3>
              <div className="mt-2 text-gray-600">
                <p>Type: {vehicle.type}</p>
                <p>Seats: {vehicle.seatingCapacity}</p>
                <p>Price: ${vehicle.basePricePerDay}/day</p>
                <p
                  className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                    vehicle.isAvailable
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {vehicle.isAvailable ? "Available" : "Not Available"}
                </p>
              </div>
              <div className="mt-4 flex space-x-2">
                <Link
                  to={`/vehicles/${vehicle._id}/edit`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </Link>
                <Link
                  to={`/vehicles/${vehicle._id}`}
                  className="text-blue-600 hover:text-blue-800 ml-4"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehiclesList;
