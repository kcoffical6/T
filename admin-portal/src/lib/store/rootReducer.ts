import { combineReducers } from "@reduxjs/toolkit";
import { bookingsApi } from "@/features/bookings/bookingsApi";
import { packagesApi } from "@/features/packages/packagesApi";
import authReducer from "@/features/auth/authSlice";
import packagesReducer from "@/features/packages/packagesSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  packages: packagesReducer,
  [bookingsApi.reducerPath]: bookingsApi.reducer,
  [packagesApi.reducerPath]: packagesApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
