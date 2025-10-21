import axios from "axios";
import { Package } from "@/types/package";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/packages`;

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
  async create(payload: Partial<Package>): Promise<Package> {
    const { data } = await axios.post(`${BASE_URL}`, payload);
    return data;
  },
  async update(id: string, payload: Partial<Package>): Promise<Package> {
    const { data } = await axios.put(`${BASE_URL}/${id}`, payload);
    return data;
  },
  async remove(id: string): Promise<{ success: boolean }> {
    const { data } = await axios.delete(`${BASE_URL}/${id}`);
    return data;
  },
};
