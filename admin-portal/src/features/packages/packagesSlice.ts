import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  packagesService,
  GetPackagesParams,
  PaginatedPackages,
} from "./packagesService";
import { Package } from "@/types/package";
// Avoid importing RootState here to prevent circular type dependency in build
import { packagesApi } from "@/features/packages/packagesApi";

interface PackagesState {
  items: Package[];
  selected: Package | null;
  loading: boolean;
  error: string | null;
}

const initialState: PackagesState = {
  items: [],
  selected: null,
  loading: false,
  error: null,
};

export const createPackage = createAsyncThunk(
  "packages/create",
  async (payload: Partial<Package>, { dispatch, rejectWithValue }) => {
    try {
      const data = await packagesService.create(payload);
      //   dispatch(
      //     packagesApi.util.invalidateTags([
      //       { type: "Packages", id: "LIST" },
      //       { type: "Packages", id: "FEATURED" },
      //     ])
      //   );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create package"
      );
    }
  }
);

export const updatePackage = createAsyncThunk(
  "packages/update",
  async (
    args: { id: string; payload: Partial<Package> },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const data = await packagesService.update(args.id, args.payload);
      dispatch(
        packagesApi.util.invalidateTags([
          { type: "Packages", id: "LIST" },
          { type: "Packages", id: data.slug },
          { type: "Packages", id: data._id as any },
          { type: "Packages", id: "FEATURED" },
        ])
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update package"
      );
    }
  }
);

export const deletePackage = createAsyncThunk(
  "packages/delete",
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      const data = await packagesService.remove(id);
      dispatch(
        packagesApi.util.invalidateTags([
          { type: "Packages", id: "LIST" },
          { type: "Packages", id: "FEATURED" },
        ])
      );
      return { id };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete package"
      );
    }
  }
);

const packagesSlice = createSlice({
  name: "packages",
  initialState,
  reducers: {
    clearSelected(state) {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createPackage.fulfilled,
        (state, action: PayloadAction<Package>) => {
          state.loading = false;
          state.items.unshift(action.payload);
        }
      )
      .addCase(createPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create package";
      })
      .addCase(updatePackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updatePackage.fulfilled,
        (state, action: PayloadAction<Package>) => {
          state.loading = false;
          const idx = state.items.findIndex(
            (p) => p._id === action.payload._id
          );
          if (idx >= 0) state.items[idx] = action.payload;
          if (state.selected && state.selected._id === action.payload._id) {
            state.selected = action.payload;
          }
        }
      )
      .addCase(updatePackage.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to update package";
      })
      .addCase(deletePackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deletePackage.fulfilled,
        (state, action: PayloadAction<{ id: string }>) => {
          state.loading = false;
          state.items = state.items.filter((p) => p._id !== action.payload.id);
        }
      )
      .addCase(deletePackage.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to delete package";
      });
  },
});

export const selectPackagesState = (state: any) => state.packages;
export const { clearSelected } = packagesSlice.actions;
export default packagesSlice.reducer;
