import { combineReducers } from "@reduxjs/toolkit";
import { bookingsApi } from "@/features/bookings/bookingsApi";
import { packagesApi } from "@/features/packages/packagesApi";
import authReducer from "@/features/auth/authSlice";
import packagesReducer from "@/features/packages/packagesSlice";
import vehiclesReducer from "@/features/vehicles/vehiclesSlice";
import usersReducer from "@/features/users/usersSlice";
import bookingsReducer from "@/features/bookings/bookingsSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  packages: packagesReducer,
  vehicles: vehiclesReducer,
  users: usersReducer,
  bookings: bookingsReducer,
  [bookingsApi.reducerPath]: bookingsApi.reducer,
  [packagesApi.reducerPath]: packagesApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
