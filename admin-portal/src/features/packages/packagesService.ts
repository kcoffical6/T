import axios from "axios";
import { Package } from "@/types/package";

const API_ROOT = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const BASE_URL = `${API_ROOT}/api/packages`;
const ADMIN_BASE_URL = `${API_ROOT}/api/admin/packages`;

export interface GetPackagesParams {
  page?: number;
  limit?: number;
  search?: string;
  region?: string;
  minPrice?: number;
  maxPrice?: number;
  minPax?: number;
  featured?: boolean;
}

export interface PaginatedPackages {
  packages: Package[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export const packagesService = {
  async list(params?: GetPackagesParams): Promise<PaginatedPackages> {
    const { data } = await axios.get(`${BASE_URL}`, { params });
    return data;
  },
  async getBySlug(slug: string): Promise<Package> {
    const { data } = await axios.get(`${BASE_URL}/${slug}`);
    return data;
  },
  async getByIdAdmin(id: string): Promise<Package> {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : undefined;
    const { data } = await axios.get(`${ADMIN_BASE_URL}/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return data;
  },
  async create(payload: Partial<Package>): Promise<Package> {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : undefined;
    const { data } = await axios.post(`${ADMIN_BASE_URL}`, payload, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return data;
  },
  async update(id: string, payload: Partial<Package>): Promise<Package> {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : undefined;
    const { data } = await axios.put(`${ADMIN_BASE_URL}/${id}`, payload, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return data;
  },
  async remove(id: string): Promise<{ success: boolean }> {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : undefined;
    const { data } = await axios.delete(`${ADMIN_BASE_URL}/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return data;
  },
  async upload(files: File[]): Promise<string[]> {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : undefined;
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    const { data } = await axios.post(`${API_ROOT}/api/uploads`, form, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        // Let browser set Content-Type multipart boundary
      },
    });
    return (data?.files || []).map((f: any) => f.url as string);
  },
};
