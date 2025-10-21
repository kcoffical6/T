import api from './api';

export interface DriverInfo {
  name: string;
  mobile: string;
  experience: number;
  licenseNumber: string;
  description: string;
  image?: string;
}

export interface VehicleData {
  _id?: string;
  make: string;
  model: string;
  year: number;
  type: string;
  seatingCapacity: number;
  features: string[];
  description: string;
  images: string[];
  basePricePerDay: number;
  driver: DriverInfo;
  isActive?: boolean;
  isAvailable?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Create a new vehicle
export const createVehicle = async (vehicleData: Omit<VehicleData, '_id' | 'createdAt' | 'updatedAt'>): Promise<VehicleData> => {
  const response = await api.post<ApiResponse<VehicleData>>('/vehicles', vehicleData);
  return response.data.data;
};

// Get paginated list of vehicles
export const getVehicles = async (params: PaginationParams = {}): Promise<PaginatedResponse<VehicleData>> => {
  const response = await api.get<ApiResponse<PaginatedResponse<VehicleData>>>('/vehicles', { params });
  return response.data.data;
};

// Get a single vehicle by ID
export const getVehicleById = async (id: string): Promise<VehicleData> => {
  const response = await api.get<ApiResponse<VehicleData>>(`/vehicles/${id}`);
  return response.data.data;
};

// Update a vehicle
export const updateVehicle = async (id: string, vehicleData: Partial<Omit<VehicleData, '_id' | 'createdAt' | 'updatedAt'>>): Promise<VehicleData> => {
  const response = await api.put<ApiResponse<VehicleData>>(`/vehicles/${id}`, vehicleData);
  return response.data.data;
};

// Delete a vehicle
export const deleteVehicle = async (id: string): Promise<{ success: boolean; message?: string }> => {
  const response = await api.delete<ApiResponse<{ success: boolean }>>(`/vehicles/${id}`);
  return { success: response.data.success, message: response.data.message };
};

// Toggle vehicle active status
export const toggleVehicleStatus = async (id: string, isActive: boolean): Promise<VehicleData> => {
  const response = await api.patch<ApiResponse<VehicleData>>(`/vehicles/${id}/status`, { isActive });
  return response.data.data;
};

// Get available vehicle types
export const getVehicleTypes = async (): Promise<Array<{ value: string; label: string }>> => {
  // This could be an API call, but for now, we'll return static data
  return [
    { value: 'sedan', label: 'Sedan' },
    { value: 'suv', label: 'SUV' },
    { value: 'van', label: 'Van' },
    { value: 'bus', label: 'Bus' },
    { value: 'luxury', label: 'Luxury' },
  ];
};

// Upload vehicle image
export const uploadVehicleImage = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await api.post<ApiResponse<{ url: string }>>('/vehicles/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data.data;
};

// Search vehicles by make, model, or type
export const searchVehicles = async (query: string): Promise<VehicleData[]> => {
  const response = await api.get<ApiResponse<VehicleData[]>>('/vehicles/search', {
    params: { q: query }
  });
  return response.data.data;
};

// Get available vehicles for a date range
export const getAvailableVehicles = async (startDate: string, endDate: string): Promise<VehicleData[]> => {
  const response = await api.get<ApiResponse<VehicleData[]>>('/vehicles/available', {
    params: { startDate, endDate }
  });
  return response.data.data;
};
