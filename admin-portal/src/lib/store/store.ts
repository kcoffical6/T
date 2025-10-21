import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { rootReducer, RootState as RootReducerState } from "./rootReducer";
import { bookingsApi } from "@/features/bookings/bookingsApi";
import { packagesApi } from "@/features/packages/packagesApi";

// Create the store with the root reducer and middleware
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(bookingsApi.middleware)
      .concat(packagesApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

// Export types
export type RootState = RootReducerState;
export type AppDispatch = typeof store.dispatch;

// Create typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Export a function to get the store state type
export const getState = (): RootState => store.getState();
