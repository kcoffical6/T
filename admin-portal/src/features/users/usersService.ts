import axios from "axios";

const API_ROOT = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const USERS_ADMIN_URL = `${API_ROOT}/api/admin/users`;

export interface UserPayload {
  name: string;
  email: string;
  phone: string;
  country: string;
  password?: string;
  role?: "user" | "admin" | "super_admin" | "driver";
}

function authHeader() {
  if (typeof window === "undefined") return undefined;
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

export const usersService = {
  async list(params?: any) {
    const { data } = await axios.get(USERS_ADMIN_URL, {
      params,
      headers: authHeader(),
    });
    return data;
  },
  async create(payload: UserPayload) {
    const { data } = await axios.post(USERS_ADMIN_URL, payload, {
      headers: authHeader(),
    });
    return data;
  },
  async getById(id: string) {
    const { data } = await axios.get(`${USERS_ADMIN_URL}/${id}`, {
      headers: authHeader(),
    });
    return data;
  },
  async update(id: string, payload: Partial<UserPayload>) {
    const { data } = await axios.put(`${USERS_ADMIN_URL}/${id}`, payload, {
      headers: authHeader(),
    });
    return data;
  },
  async remove(id: string) {
    const { data } = await axios.delete(`${USERS_ADMIN_URL}/${id}`, {
      headers: authHeader(),
    });
    return data;
  },
};
