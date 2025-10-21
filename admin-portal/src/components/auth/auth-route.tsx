"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  selectIsAuthenticated,
  selectIsLoading,
  fetchUserProfile,
} from "@/features/auth/authSlice";
import { Loader2 } from "lucide-react";

interface AuthRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  loadingComponent?: React.ReactNode;
  unauthorizedComponent?: React.ReactNode;
}

export default function AuthRoute({
  children,
  requiredRole,
  loadingComponent,
  unauthorizedComponent,
}: AuthRouteProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const user = useAppSelector((state) => state.auth.user);

  // Check authentication status and fetch user profile if needed
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      // If there's a token but no user data, try to fetch the profile
      const token = localStorage.getItem("auth_tokens");
      if (token) {
        dispatch(fetchUserProfile());
      } else {
        router.push("/login");
      }
    }
  }, [isAuthenticated, isLoading, dispatch, router]);

  // Check user role if required
  const hasRequiredRole = !requiredRole || user?.role === requiredRole;

  // Show loading state
  if (isLoading || (!isAuthenticated && localStorage.getItem("auth_tokens"))) {
    return (
      loadingComponent || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading...</p>
          </div>
        </div>
      )
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Store the current URL to redirect back after login
    if (typeof window !== "undefined") {
      sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
    }
    router.push("/login");
    return null;
  }

  // Show unauthorized message if user doesn't have the required role
  if (!hasRequiredRole) {
    return (
      unauthorizedComponent || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center p-6 max-w-md mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You don't have permission to access this page.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )
    );
  }

  // User is authenticated and has the required role
  return <>{children}</>;
}

// Higher-order component for protecting routes
export function withAuth<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  options?: {
    requiredRole?: string;
    loadingComponent?: React.ReactNode;
    unauthorizedComponent?: React.ReactNode;
  }
) {
  return function WithAuthComponent(props: T) {
    return (
      <AuthRoute
        requiredRole={options?.requiredRole}
        loadingComponent={options?.loadingComponent}
        unauthorizedComponent={options?.unauthorizedComponent}
      >
        <WrappedComponent {...props} />
      </AuthRoute>
    );
  };
}
