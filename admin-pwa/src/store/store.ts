import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { persistStore } from "redux-persist";
import rootReducer, { RootState } from "./reducer";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// const persistedReducer = persistReducer(persistConfig, rootReducer);

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "user"],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"], // Ignore specific actions
        ignoredPaths: ["register"], // Optionally ignore specific paths in the state
      },
    }),
});

export const persistor = persistStore(store, null, () => {
  // This callback runs after rehydration is complete
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
