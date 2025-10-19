import { combineReducers } from "redux";
import authReducer from "../features/auth/authSlice";
import { Action } from "redux";
import vehiclesReducer from "../features/vehicles/vehicleSlice";
// Combine all reducers into a single root reducer
const appReducer = combineReducers({
  auth: authReducer,
  vehicles: vehiclesReducer,
});

export type RootState = ReturnType<typeof appReducer>;

const rootReducer = (state: RootState | undefined, action: Action) => {
  if (action.type === "RESET_STORE") {
    state = undefined; // Reset state on specific action if needed
  }
  return appReducer(state, action);
};

export default rootReducer;
