import React, {
  createContext,
  useContext,
  ReactNode,
  Component,
  ErrorInfo,
} from "react";
import { useMetaMask } from "../hooks/useMetaMask";

// Error Boundary component
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error("Error in MetaMask context:", error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error boundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null; // or return a fallback UI
    }
    return this.props.children;
  }
}

export interface MetaMaskContextType {
  isMetaMaskInstalled: boolean;
  isConnected: boolean;
  account: string | null;
  connect: () => Promise<string | null>;
  error: string | null;
}

const MetaMaskContext = createContext<MetaMaskContextType | undefined>(
  undefined
);

export const useMetaMaskContext = (): MetaMaskContextType => {
  const context = useContext(MetaMaskContext);
  if (context === undefined) {
    throw new Error(
      "useMetaMaskContext must be used within a MetaMaskProvider"
    );
  }
  return context;
};

interface MetaMaskProviderProps {
  children: ReactNode;
}

export const MetaMaskProvider: React.FC<MetaMaskProviderProps> = ({
  children,
}) => {
  try {
    const metaMask = useMetaMask();

    return (
      <ErrorBoundary>
        <MetaMaskContext.Provider value={metaMask}>
          {children}
        </MetaMaskContext.Provider>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error("Failed to initialize MetaMask provider:", error);
    // Return children without MetaMask context to prevent white screen
    return <>{children}</>;
  }
};
