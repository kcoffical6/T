import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Vehicles } from "./pages/vehicles/Vehicles";
import CreateVehicle from "./pages/vehicles/CreateVehicle";
// import EditVehicle from "./pages/vehicles/EditVehicle";
import VehicleDetails from "./pages/vehicles/VehicleDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/vehicles",
        children: [
          {
            index: true,
            element: <Vehicles />,
          },
          {
            path: "new",
            element: <CreateVehicle />,
          },
          {
            path: ":id",
            element: <VehicleDetails />,
          },
          {
            path: ":id/edit",
            // element: <EditVehicle />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
