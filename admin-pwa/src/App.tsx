import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { MetaMaskProvider } from "./contexts/MetaMaskContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { PendingApprovals } from "./pages/PendingApprovals";
import { FleetManagement } from "./pages/FleetManagement";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";
import { Login } from "./pages/Login";
import { Packages } from "./pages/Packages";
import { PackageDetail } from "./pages/PackageDetail";
import { PackageForm } from "./components/PackageForm";
import "./index.css";
import VehiclesList from "./pages/vehicles/VehiclesList";
import VehicleFormPage from "./pages/vehicles/VehicleFormPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MetaMaskProvider>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Navigate to="/dashboard" replace />
                  </ProtectedRoute>
                }
              />
              <Route
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Outlet />
                    </Layout>
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route
                  path="pending-approvals"
                  element={<PendingApprovals />}
                />
                <Route path="fleet" element={<FleetManagement />} />
                <Route path="vehicles" element={<VehiclesList />} />
                <Route path="vehicles/new" element={<VehicleFormPage />} />
                <Route path="vehicles/:id" element={<VehicleFormPage />} />
                <Route path="vehicles/:id/edit" element={<VehicleFormPage />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
                <Route path="packages" element={<Packages />} />
                <Route path="packages/new" element={<PackageForm />} />
                <Route path="packages/:id" element={<PackageDetail />} />
                <Route path="packages/:id/edit" element={<PackageForm />} />
              </Route>
            </Routes>

            <Toaster
              position="top-right"
              toastOptions={{
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: "#10b981",
                    secondary: "#fff",
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#fff",
                  },
                },
              }}
            />
          </div>
        </MetaMaskProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
