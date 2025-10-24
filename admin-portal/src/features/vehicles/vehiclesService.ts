import axios from "axios";

const API_ROOT = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const VEHICLES_BASE_URL = `${API_ROOT}/api/vehicles`;

export interface VehiclePayload {
  make: string;
  model: string;
  year: number;
  type: string;
  seatingCapacity: number;
  features?: string[];
  description?: string;
  images?: string[];
  isAvailable?: boolean;
  basePricePerDay: number;
  driver: {
    name: string;
    mobile: string;
    experience: number;
    licenseNumber: string;
    description?: string;
    image?: string;
  };
}

export const vehiclesService = {
  async list(params?: any) {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : undefined;
    const { data } = await axios.get(VEHICLES_BASE_URL, {
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return data;
  },
  async create(payload: VehiclePayload) {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : undefined;
    const { data } = await axios.post(VEHICLES_BASE_URL, payload, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return data;
  },
  async getById(id: string) {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : undefined;
    const { data } = await axios.get(`${VEHICLES_BASE_URL}/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return data;
  },
  async update(id: string, payload: Partial<VehiclePayload>) {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : undefined;
    const { data } = await axios.put(`${VEHICLES_BASE_URL}/${id}`, payload, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return data;
  },
  async remove(id: string) {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : undefined;
    const { data } = await axios.delete(`${VEHICLES_BASE_URL}/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return data;
  },
  async toggleAvailability(id: string) {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : undefined;
    const { data } = await axios.patch(`${VEHICLES_BASE_URL}/${id}?action=toggle-availability`, null, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return data;
  },
};
