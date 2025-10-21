import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store/store";
import axios from "@/lib/axios";

// Types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  phoneNumber?: string;
  lastLogin?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface AuthState {
  user: UserProfile | null;
  tokens: {
    accessToken: string | null;
    refreshToken: string | null;
    expiresAt: number | null;
  };
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

// Helper functions for token management
const TOKEN_KEY = "auth_tokens";

const getStoredTokens = (): {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
} => {
  if (typeof window === "undefined") {
    return { accessToken: null, refreshToken: null, expiresAt: null };
  }

  const storedTokens = localStorage.getItem(TOKEN_KEY);
  if (!storedTokens)
    return { accessToken: null, refreshToken: null, expiresAt: null };

  try {
    const { accessToken, refreshToken, expiresAt } = JSON.parse(storedTokens);
    return { accessToken, refreshToken, expiresAt };
  } catch (error) {
    console.error("Failed to parse stored tokens", error);
    return { accessToken: null, refreshToken: null, expiresAt: null };
  }
};

const storeTokens = (tokens: {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}) => {
  const expiresAt = Date.now() + tokens.expiresIn * 1000;
  const tokensToStore = {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresAt,
  };
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokensToStore));
  return tokensToStore;
};

const clearStoredTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Initial state
const { accessToken, refreshToken, expiresAt } = getStoredTokens();

const initialState: AuthState = {
  user: null,
  tokens: {
    accessToken,
    refreshToken,
    expiresAt,
  },
  isAuthenticated: !!accessToken,
  loading: false,
  error: null,
  lastFetched: null,
};

// Async Thunks
export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post("/login", credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || "Login failed",
        status: error.response?.status,
      });
    }
  }
);

// Register (Signup)
export const register = createAsyncThunk(
  "auth/register",
  async (
    payload: {
      name: string;
      email: string;
      phone: string;
      password: string;
      country: string;
      role: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post("/signup", payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || "Registration failed",
        status: error.response?.status,
      });
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/me");
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch profile",
        status: error.response?.status,
      });
    }
  }
);

export const refreshTokens = createAsyncThunk(
  "auth/refreshTokens",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      const response = await axios.post("/refresh-token", {
        refreshToken: auth.tokens?.refreshToken,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to refresh token",
        status: error.response?.status,
      });
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.tokens = { accessToken: null, refreshToken: null, expiresAt: null };
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      clearStoredTokens();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.tokens = storeTokens({
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        expiresIn: action.payload.expiresIn,
      });
      state.lastFetched = Date.now();
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload as string;
      state.user = null;
      state.tokens = { accessToken: null, refreshToken: null, expiresAt: null };
      clearStoredTokens();
    });

    // Register
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state) => {
      state.loading = false;
      // Do not auto-authenticate on register unless API returns tokens explicitly
      // Keep current auth state unchanged.
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as any)?.message || "Registration failed";
    });

    // Fetch User Profile
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.lastFetched = Date.now();
    });
    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      // Don't log out on profile fetch failure
    });

    // Refresh Tokens
    builder.addCase(refreshTokens.fulfilled, (state, action) => {
      state.tokens = storeTokens({
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        expiresIn: action.payload.expiresIn,
      });
      state.lastFetched = Date.now();
    });
    builder.addCase(refreshTokens.rejected, (state) => {
      // If token refresh fails, log the user out
      state.isAuthenticated = false;
      state.user = null;
      state.tokens = { accessToken: null, refreshToken: null, expiresAt: null };
      clearStoredTokens();
    });
  },
});

// Selectors
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectIsLoading = (state: RootState) => state.auth.loading;
export const selectError = (state: RootState) => state.auth.error;
export const selectAccessToken = (state: RootState) =>
  state.auth.tokens.accessToken;

// Export actions
export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;
