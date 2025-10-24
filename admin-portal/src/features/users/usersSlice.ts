import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { usersService, UserPayload } from "./usersService";

export interface UserStateItem {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  role: "user" | "admin" | "super_admin" | "driver";
}

interface UsersState {
  items: UserStateItem[];
  selected: UserStateItem | null;
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  items: [],
  selected: null,
  loading: false,
  error: null,
};

export const createUser = createAsyncThunk(
  "users/create",
  async (payload: UserPayload, { rejectWithValue }) => {
    try {
      const data = await usersService.create(payload);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create user");
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/update",
  async (args: { id: string; payload: Partial<UserPayload> }, { rejectWithValue }) => {
    try {
      const data = await usersService.update(args.id, args.payload);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update user");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await usersService.remove(id);
      return { id };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete user");
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearSelected(state) {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<UserStateItem>) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create user";
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<UserStateItem>) => {
        state.loading = false;
        const idx = state.items.findIndex((u) => u._id === action.payload._id);
        if (idx >= 0) state.items[idx] = action.payload;
        if (state.selected && state.selected._id === action.payload._id) {
          state.selected = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to update user";
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.loading = false;
        state.items = state.items.filter((u) => u._id !== action.payload.id);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to delete user";
      });
  },
});

export const selectUsersState = (state: any) => state.users;
export const { clearSelected } = usersSlice.actions;
export default usersSlice.reducer;
