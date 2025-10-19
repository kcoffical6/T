import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("admin_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }).then((res) => res.data),

  getProfile: () => api.get("/auth/profile").then((res) => res.data),
};

export const bookingsApi = {
  getPendingApprovals: () =>
    api.get("/admin/bookings?status=pending_approval").then((res) => res.data),

  getBooking: (id: string) =>
    api.get(`/admin/bookings/${id}`).then((res) => res.data),

  approveBooking: (id: string, data: any) =>
    api.post(`/admin/bookings/${id}/approve`, data).then((res) => res.data),

  rejectBooking: (id: string, reason: string) =>
    api
      .post(`/admin/bookings/${id}/reject`, { reason })
      .then((res) => res.data),

  getAllBookings: (params?: any) =>
    api.get("/admin/bookings", { params }).then((res) => res.data),
};

export const vehiclesApi = {
  getAllVehicles: () => api.get("/admin/vehicles").then((res) => res.data),

  toggleAvailability: (id: string) =>
    api
      .patch(`/admin/vehicles/${id}/availability-toggle`)
      .then((res) => res.data),

  blockDates: (id: string, data: any) =>
    api.post(`/admin/vehicles/${id}/block-dates`, data).then((res) => res.data),

  updateVehicle: (id: string, data: any) =>
    api.patch(`/admin/vehicles/${id}`, data).then((res) => res.data),
};

export const reportsApi = {
  getRevenueReport: (params?: any) =>
    api.get("/admin/reports/revenue", { params }).then((res) => res.data),

  getCommissionReport: (params?: any) =>
    api.get("/admin/reports/commission", { params }).then((res) => res.data),

  getOccupancyReport: (params?: any) =>
    api.get("/admin/reports/occupancy", { params }).then((res) => res.data),

  exportBookings: (params?: any) =>
    api
      .get("/admin/reports/export/bookings", { params, responseType: "blob" })
      .then((res) => res.data),
};

export const packagesApi = {
  getAllPackages: () => api.get("/admin/packages").then((res) => res.data),

  getPackage: (id: string) =>
    api.get(`/admin/packages/${id}`).then((res) => res.data),

  createPackage: (data: any) =>
    api.post("/admin/packages", data).then((res) => res.data),

  updatePackage: (id: string, data: any) =>
    api.put(`/admin/packages/${id}`, data).then((res) => res.data),

  deletePackage: (id: string) =>
    api.delete(`/admin/packages/${id}`).then((res) => res.data),

  togglePackageStatus: (id: string, isActive: boolean) =>
    api
      .patch(`/admin/packages/${id}/status`, { isActive })
      .then((res) => res.data),
};

export default api;
