import axios from "axios";

const API_ROOT = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const BOOKINGS_ADMIN_URL = `${API_ROOT}/api/admin/bookings`;

export interface BookingPayload {
  userId: string;
  packageId: string;
  passengers: { name: string; age: number; passport?: string }[];
  totalAmount: number;
  status?: "pending" | "approved" | "rejected" | "cancelled" | "completed";
  paymentStatus?: "pending" | "paid" | "refunded";
  bookingDate: string; // ISO
  travelDate: string; // ISO
  specialRequests?: string;
}

function authHeader() {
  if (typeof window === "undefined") return undefined;
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

export const bookingsService = {
  async list(params?: any) {
    const { data } = await axios.get(BOOKINGS_ADMIN_URL, {
      params,
      headers: authHeader(),
    });
    return data;
  },
  async create(payload: BookingPayload) {
    const { data } = await axios.post(BOOKINGS_ADMIN_URL, payload, {
      headers: authHeader(),
    });
    return data;
  },
  async getById(id: string) {
    const { data } = await axios.get(`${BOOKINGS_ADMIN_URL}/${id}`, {
      headers: authHeader(),
    });
    return data;
  },
  async update(id: string, payload: Partial<BookingPayload>) {
    const { data } = await axios.put(`${BOOKINGS_ADMIN_URL}/${id}`, payload, {
      headers: authHeader(),
    });
    return data;
  },
  async remove(id: string) {
    const { data } = await axios.delete(`${BOOKINGS_ADMIN_URL}/${id}`, {
      headers: authHeader(),
    });
    return data;
  },
};
