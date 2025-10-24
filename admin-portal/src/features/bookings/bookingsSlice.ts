import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { bookingsService, BookingPayload } from "./bookingsService";

export interface BookingStateItem {
  _id?: string;
  userId?: string;
  packageId?: string;
  passengers: { name: string; age: number; passport?: string }[];
  totalAmount: number;
  status: "pending" | "approved" | "rejected" | "cancelled" | "completed";
  paymentStatus: "pending" | "paid" | "refunded";
  bookingDate: string;
  travelDate: string;
  specialRequests?: string;
}

interface BookingsState {
  items: BookingStateItem[];
  selected: BookingStateItem | null;
  loading: boolean;
  error: string | null;
}

const initialState: BookingsState = {
  items: [],
  selected: null,
  loading: false,
  error: null,
};

export const createBooking = createAsyncThunk(
  "bookings/create",
  async (payload: BookingPayload, { rejectWithValue }) => {
    try {
      const data = await bookingsService.create(payload);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create booking");
    }
  }
);

export const updateBooking = createAsyncThunk(
  "bookings/update",
  async (args: { id: string; payload: Partial<BookingPayload> }, { rejectWithValue }) => {
    try {
      const data = await bookingsService.update(args.id, args.payload);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update booking");
    }
  }
);

export const deleteBooking = createAsyncThunk(
  "bookings/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await bookingsService.remove(id);
      return { id };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete booking");
    }
  }
);

const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    clearSelected(state) {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action: PayloadAction<BookingStateItem>) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create booking";
      })
      .addCase(updateBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBooking.fulfilled, (state, action: PayloadAction<BookingStateItem>) => {
        state.loading = false;
        const idx = state.items.findIndex((b) => b._id === action.payload._id);
        if (idx >= 0) state.items[idx] = action.payload;
        if (state.selected && state.selected._id === action.payload._id) {
          state.selected = action.payload;
        }
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to update booking";
      })
      .addCase(deleteBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBooking.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.loading = false;
        state.items = state.items.filter((b) => b._id !== action.payload.id);
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to delete booking";
      });
  },
});

export const selectBookingsState = (state: any) => state.bookings;
export const { clearSelected } = bookingsSlice.actions;
export default bookingsSlice.reducer;
