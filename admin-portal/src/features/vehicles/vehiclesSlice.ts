import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { vehiclesService, VehiclePayload } from "./vehiclesService";

export interface VehicleStateItem {
  _id?: string;
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

interface VehiclesState {
  items: VehicleStateItem[];
  selected: VehicleStateItem | null;
  loading: boolean;
  error: string | null;
}

const initialState: VehiclesState = {
  items: [],
  selected: null,
  loading: false,
  error: null,
};

export const createVehicle = createAsyncThunk(
  "vehicles/create",
  async (payload: VehiclePayload, { rejectWithValue }) => {
    try {
      const data = await vehiclesService.create(payload);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create vehicle");
    }
  }
);

export const updateVehicle = createAsyncThunk(
  "vehicles/update",
  async (args: { id: string; payload: Partial<VehiclePayload> }, { rejectWithValue }) => {
    try {
      const data = await vehiclesService.update(args.id, args.payload);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update vehicle");
    }
  }
);

export const deleteVehicle = createAsyncThunk(
  "vehicles/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await vehiclesService.remove(id);
      return { id };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete vehicle");
    }
  }
);

const vehiclesSlice = createSlice({
  name: "vehicles",
  initialState,
  reducers: {
    clearSelected(state) {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVehicle.fulfilled, (state, action: PayloadAction<VehicleStateItem>) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create vehicle";
      })
      .addCase(updateVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVehicle.fulfilled, (state, action: PayloadAction<VehicleStateItem>) => {
        state.loading = false;
        const idx = state.items.findIndex((v) => v._id === action.payload._id);
        if (idx >= 0) state.items[idx] = action.payload;
        if (state.selected && state.selected._id === action.payload._id) {
          state.selected = action.payload;
        }
      })
      .addCase(updateVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to update vehicle";
      })
      .addCase(deleteVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVehicle.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.loading = false;
        state.items = state.items.filter((v) => v._id !== action.payload.id);
      })
      .addCase(deleteVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to delete vehicle";
      });
  },
});

export const selectVehiclesState = (state: any) => state.vehicles;
export const { clearSelected } = vehiclesSlice.actions;
export default vehiclesSlice.reducer;
