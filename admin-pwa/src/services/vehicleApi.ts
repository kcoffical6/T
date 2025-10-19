import api from "./api";

export interface IDriver {
  name: string;
  mobile: string;
  experience: number;
  licenseNumber: string;
  description?: string;
  image?: string;
}

export interface IVehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  type: string;
  seatingCapacity: number;
  features: string[];
  description?: string;
  images: string[];
  isAvailable: boolean;
  basePricePerDay: number;
  driver: IDriver;
  createdAt: string;
  updatedAt: string;
}

export const vehicleApi = {
  // Get all vehicles with optional filters
  getVehicles: async (params?: {
    type?: string;
    minSeats?: number;
    maxPrice?: number;
    search?: string;
    isAvailable?: boolean;
  }) => {
    const response = await api.get<IVehicle[]>("/api/vehicles", { params });
    return response.data;
  },

  // Get a single vehicle by ID
  getVehicle: async (id: string) => {
    const response = await api.get<IVehicle>(`/api/vehicles/${id}`);
    return response.data;
  },

  // Create a new vehicle
  createVehicle: async (
    data: Omit<IVehicle, "_id" | "createdAt" | "updatedAt">
  ) => {
    const response = await api.post<IVehicle>("/api/vehicles", data);
    return response.data;
  },

  // Update an existing vehicle
  updateVehicle: async (id: string, data: Partial<IVehicle>) => {
    const response = await api.put<IVehicle>(`/api/vehicles/${id}`, data);
    return response.data;
  },

  // Delete a vehicle
  deleteVehicle: async (id: string) => {
    await api.delete(`/api/vehicles/${id}`);
  },

  // Toggle vehicle availability
  toggleAvailability: async (id: string) => {
    const response = await api.patch<IVehicle>(
      `/api/vehicles/${id}?action=toggle-availability`
    );
    return response.data;
  },

  // Upload vehicle image
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<{ url: string }>("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.url;
  },
};
