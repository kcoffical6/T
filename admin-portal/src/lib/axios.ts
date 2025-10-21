import axios from "axios";
import { auth_URL } from "./API_url";

// Only import store in browser environment
let store: any;

if (typeof window !== "undefined") {
  // Dynamic import to avoid server-side execution
  import("@/lib/store/store").then((module) => {
    store = module.store;
  });
}

const axiosInstance = axios.create({
  baseURL: auth_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to add auth token to requests
if (typeof window !== "undefined") {
  axiosInstance.interceptors.request.use(
    (config) => {
      if (!store) return config;

      const { auth } = store.getState();
      if (auth?.tokens?.accessToken) {
        config.headers.Authorization = `Bearer ${auth.tokens.accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

// Response interceptor to handle token refresh
if (typeof window !== "undefined") {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If error is not 401 or it's a retry request, reject
      if (error.response?.status !== 401 || originalRequest._retry || !store) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const { auth } = store.getState();
        const response = await axios.post(`${auth_URL}/refresh-token`, {
          refreshToken: auth.tokens?.refreshToken,
        });

        const { accessToken, refreshToken } = response.data;
        store.dispatch({
          type: "auth/refreshTokens/fulfilled",
          payload: { accessToken, refreshToken },
        });

        // Update the Authorization header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (error) {
        // If refresh token fails, logout the user
        if (store) {
          store.dispatch({ type: "auth/logout" });
        }
        return Promise.reject(error);
      }
    }
  );
}

export default axiosInstance;
