import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { vehicleApi, IVehicle } from "../../services/vehicleApi";

export interface VehicleState {
  vehicles: IVehicle[];
  currentVehicle: IVehicle | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: VehicleState = {
  vehicles: [],
  currentVehicle: null,
  status: "idle",
  error: null,
};

// Async thunks
export const fetchVehicles = createAsyncThunk(
  "vehicles/fetchVehicles",
  async (_, { rejectWithValue }) => {
    try {
      return await vehicleApi.getVehicles();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch vehicles"
      );
    }
  }
);

export const fetchVehicleById = createAsyncThunk(
  "vehicles/fetchVehicleById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await vehicleApi.getVehicle(id);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch vehicle"
      );
    }
  }
);

export const createNewVehicle = createAsyncThunk(
  "vehicles/createVehicle",
  async (
    vehicleData: Omit<IVehicle, "_id" | "createdAt" | "updatedAt">,
    { rejectWithValue }
  ) => {
    try {
      return await vehicleApi.createVehicle(vehicleData);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create vehicle"
      );
    }
  }
);

export const updateExistingVehicle = createAsyncThunk(
  "vehicles/updateVehicle",
  async (
    { id, data }: { id: string; data: Partial<IVehicle> },
    { rejectWithValue }
  ) => {
    try {
      return await vehicleApi.updateVehicle(id, data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update vehicle"
      );
    }
  }
);

export const deleteExistingVehicle = createAsyncThunk(
  "vehicles/deleteVehicle",
  async (id: string, { rejectWithValue }) => {
    try {
      await vehicleApi.deleteVehicle(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete vehicle"
      );
    }
  }
);

const vehicleSlice = createSlice({
  name: "vehicles",
  initialState,
  reducers: {
    clearCurrentVehicle: (state) => {
      state.currentVehicle = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all vehicles
      .addCase(fetchVehicles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchVehicles.fulfilled,
        (state, action: PayloadAction<IVehicle[]>) => {
          state.status = "succeeded";
          state.vehicles = action.payload;
        }
      )
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Fetch single vehicle
      .addCase(fetchVehicleById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchVehicleById.fulfilled,
        (state, action: PayloadAction<IVehicle>) => {
          state.status = "succeeded";
          state.currentVehicle = action.payload;
        }
      )
      // Create vehicle
      .addCase(
        createNewVehicle.fulfilled,
        (state, action: PayloadAction<IVehicle>) => {
          state.vehicles.push(action.payload);
        }
      )
      // Update vehicle
      .addCase(
        updateExistingVehicle.fulfilled,
        (state, action: PayloadAction<IVehicle>) => {
          const index = state.vehicles.findIndex(
            (vehicle: IVehicle) => vehicle._id === action.payload._id
          );
          if (index !== -1) {
            state.vehicles[index] = action.payload;
          }
          if (state.currentVehicle?._id === action.payload._id) {
            state.currentVehicle = action.payload;
          }
        }
      )
      // Delete vehicle
      .addCase(
        deleteExistingVehicle.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.vehicles = state.vehicles.filter(
            (vehicle: IVehicle) => vehicle._id !== action.payload
          );
        }
      );
  },
});

export const { clearCurrentVehicle } = vehicleSlice.actions;
export default vehicleSlice.reducer;
