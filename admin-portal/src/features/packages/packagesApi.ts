import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Package } from "@/types/package";

export interface PaginatedPackages {
  packages: Package[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

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

export const packagesApi = createApi({
  reducerPath: "packagesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/`,
  }),
  tagTypes: ["Packages"],
  endpoints: (builder) => ({
    getPackages: builder.query<PaginatedPackages, GetPackagesParams | void>({
      query: (params) => ({
        url: "packages",
        params: params || {},
      }),
      providesTags: (result) =>
        result && result.packages
          ? [
              ...result.packages.map((pkg) => ({
                type: "Packages" as const,
                id: (pkg as any)._id,
              })),
              { type: "Packages", id: "LIST" },
            ]
          : [{ type: "Packages", id: "LIST" }],
    }),

    getPackageBySlug: builder.query<Package, string>({
      query: (slug) => `packages/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Packages", id: slug }],
    }),

    getFeaturedPackages: builder.query<
      { packages: Package[] },
      { limit?: number } | void
    >({
      query: (params) => ({
        url: "packages/featured",
        params: params || {},
      }),
      providesTags: (result) =>
        result && result.packages
          ? [
              ...result.packages.map((pkg) => ({
                type: "Packages" as const,
                id: (pkg as any)._id,
              })),
              { type: "Packages", id: "FEATURED" },
            ]
          : [{ type: "Packages", id: "FEATURED" }],
    }),
  }),
});

export const {
  useGetPackagesQuery,
  useGetPackageBySlugQuery,
  useGetFeaturedPackagesQuery,
} = packagesApi;
