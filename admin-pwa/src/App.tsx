import React, { useEffect, Suspense, useState, FC, ReactNode } from "react";
import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "react-error-boundary";

// --- MOCK IMPLEMENTATIONS ---
// The following components, hooks, and functions are mocked to resolve the import errors.
// In a real application, these would be imported from their respective files.

const mockState = {
  auth: {
    isAuthenticated: true, // Set to `false` to test the public/login route
    isLoading: false,
    user: { name: "John Doe", email: "john.doe@example.com", role: "admin" },
  },
};

// Mock Redux hooks and actions
const useAppDispatch = () => () => console.log("Dispatch action triggered");
const useAppSelector = (selector: (state: typeof mockState) => any) =>
  selector(mockState);
const selectIsAuthenticated = (state: typeof mockState) =>
  state.auth.isAuthenticated;
const selectAuthLoading = (state: typeof mockState) => state.auth.isLoading;
const logout = () => console.log("logout action triggered");
const checkAuth = () => console.log("checkAuth action triggered");

// Mock UI Components
const PageLoader: FC = () => (
  <div className="flex items-center justify-center h-screen w-full text-white">
    Loading...
  </div>
);
const ErrorFallback: FC<{ error: Error }> = ({ error }) => (
  <div
    role="alert"
    className="p-4 bg-red-100 border border-red-400 text-red-700 rounded"
  >
    <p>Something went wrong:</p>
    <pre className="text-sm">{error.message}</pre>
  </div>
);

// A generic placeholder for all page components
const MockPage: FC<{ title: string }> = ({ title }) => (
  <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
      {title}
    </h1>
    <p className="mt-2 text-gray-600 dark:text-gray-300">
      This is a placeholder for the {title} page.
    </p>
  </div>
);

// --- MOCK PAGES & COMPONENTS ---
const Login: FC = () => <MockPage title="Login" />;
const Dashboard: FC = () => <MockPage title="Dashboard" />;
const PendingApprovals: FC = () => <MockPage title="Pending Approvals" />;
const FleetManagement: FC = () => <MockPage title="Fleet Management" />;
const Packages: FC = () => <MockPage title="Packages" />;
const PackageForm: FC = () => <MockPage title="Package Form" />;
const PackageDetail: FC = () => <MockPage title="Package Detail" />;
const Vehicles: FC = () => <MockPage title="Vehicles" />;
const CreateVehicle: FC = () => <MockPage title="Create Vehicle" />;
const VehicleDetails: FC = () => <MockPage title="Vehicle Details" />;
const Drivers: FC = () => <MockPage title="Drivers" />;
const CreateDriver: FC = () => <MockPage title="Create Driver" />;
const DriverDetails: FC = () => <MockPage title="Driver Details" />;
const Bookings: FC = () => <MockPage title="Bookings" />;
const CreateBooking: FC = () => <MockPage title="Create Booking" />;
const BookingDetails: FC = () => <MockPage title="Booking Details" />;
const Reports: FC = () => <MockPage title="Reports" />;
const Settings: FC = () => <MockPage title="Settings" />;
const Profile: FC = () => <MockPage title="Profile" />;
const NotFound: FC = () => <MockPage title="404 Not Found" />;

// Mock Header and Sidebar
const Header: FC<{ onMenuToggle: () => void }> = ({ onMenuToggle }) => (
  <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center text-gray-900 dark:text-white">
    <button onClick={onMenuToggle}>Menu</button>
    <h1 className="text-xl font-semibold">Fleet Management</h1>
    <div>User Profile</div>
  </header>
);

const Sidebar: FC<{
  isOpen: boolean;
  onToggle: () => void;
  user: any;
  onLogout: () => void;
}> = ({ isOpen, onToggle, user, onLogout }) => (
  <aside
    className={`transition-all duration-300 bg-gray-700 text-white ${isOpen ? "w-64" : "w-0"} overflow-hidden`}
  >
    <div className="p-4">
      <h2 className="text-lg font-bold">{user?.name}</h2>
      <p className="text-sm text-gray-400">{user?.role}</p>
      <nav className="mt-8">
        <ul>
          <li className="p-2 hover:bg-gray-600 rounded cursor-pointer">
            Dashboard
          </li>
          <li className="p-2 hover:bg-gray-600 rounded cursor-pointer">
            Bookings
          </li>
          <li className="p-2 hover:bg-gray-600 rounded cursor-pointer">
            Drivers
          </li>
          <li className="p-2 hover:bg-gray-600 rounded cursor-pointer">
            Vehicles
          </li>
        </ul>
      </nav>
      <button
        onClick={onLogout}
        className="mt-8 w-full bg-red-500 hover:bg-red-600 text-white p-2 rounded"
      >
        Logout
      </button>
    </div>
  </aside>
);

// --- LAYOUT COMPONENT ---
const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleLogout = () => dispatch(logout());

  useEffect(() => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header onMenuToggle={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
          user={user}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<PageLoader />}>
                <Outlet />
              </Suspense>
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
};

// --- ROUTE PROTECTION COMPONENTS ---
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const location = useLocation();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const location = useLocation();

  if (isLoading) {
    return <PageLoader />;
  }

  if (isAuthenticated) {
    const from =
      (location.state as { from?: Location })?.from?.pathname || "/dashboard";
    return <Navigate to={from} replace />;
  }

  return children;
};

// --- MAIN APP COMPONENT ---
function App() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <PageLoader />
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: "#fff",
            color: "#111827",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Suspense fallback={<PageLoader />}>
                <Login />
              </Suspense>
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="pending-approvals" element={<PendingApprovals />} />
          <Route path="fleet" element={<FleetManagement />} />

          <Route path="packages">
            <Route index element={<Packages />} />
            <Route path="new" element={<PackageForm />} />
            <Route path=":id" element={<PackageDetail />} />
            <Route path=":id/edit" element={<PackageForm />} />
          </Route>

          <Route path="bookings">
            <Route index element={<Bookings />} />
            <Route path="new" element={<CreateBooking />} />
            <Route path=":id" element={<BookingDetails />} />
          </Route>

          <Route path="drivers">
            <Route index element={<Drivers />} />
            <Route path="new" element={<CreateDriver />} />
            <Route path=":id" element={<DriverDetails />} />
          </Route>

          <Route path="vehicles">
            <Route index element={<Vehicles />} />
            <Route path="new" element={<CreateVehicle />} />
            <Route path=":id" element={<VehicleDetails />} />
          </Route>

          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
