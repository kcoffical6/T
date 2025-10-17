import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useMutation } from "react-query";
import { authApi } from "../services/api";
import toast from "react-hot-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "driver" | "user";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; role?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      // Verify token and get user info
      authApi
        .getProfile()
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem("admin_token");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const loginMutation = useMutation(
    ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    {
      onSuccess: (data) => {
        localStorage.setItem("admin_token", data.access_token);
        setUser(data.user);
        toast.success("Welcome back!");
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Login failed");
      },
    }
  );

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; role?: string }> => {
    try {
      const data = await loginMutation.mutateAsync({ email, password });
      return { success: true, role: data.user.role };
    } catch (error) {
      return { success: false };
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setUser(null);
    toast.success("Logged out successfully");
  };

  const isAuthenticated = !!user;
  const hasRole = (role: string) => user?.role === role;

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
