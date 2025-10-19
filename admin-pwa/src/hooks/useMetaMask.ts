import { useState, useEffect } from "react";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface MetaMaskHook {
  isMetaMaskInstalled: boolean;
  isConnected: boolean;
  account: string | null;
  connect: () => Promise<string | null>;
  error: string | null;
}

export const useMetaMask = (): MetaMaskHook => {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] =
    useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if MetaMask is installed
  useEffect(() => {
    try {
      const isInstalled = !!(
        typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask
      );
      setIsMetaMaskInstalled(isInstalled);

      if (!isInstalled) {
        console.warn("MetaMask is not installed");
        return;
      }

      // Check if already connected
      const checkConnection = async () => {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
          }
        } catch (err) {
          console.error("Error checking MetaMask connection:", err);
          setError("Failed to check MetaMask connection");
        }
      };

      checkConnection();

      // Listen for account changes
      const handleAccountsChanged = (accounts: string[]) => {
        try {
          if (!accounts || accounts.length === 0) {
            setAccount(null);
            setIsConnected(false);
          } else {
            setAccount(accounts[0]);
            setIsConnected(true);
          }
        } catch (err) {
          console.error("Error handling accounts changed:", err);
          setError("Failed to handle account change");
        }
      };

      try {
        window.ethereum.on("accountsChanged", handleAccountsChanged);
      } catch (err) {
        console.error("Failed to set up accountsChanged listener:", err);
      }

      return () => {
        try {
          if (window.ethereum) {
            window.ethereum.removeListener(
              "accountsChanged",
              handleAccountsChanged
            );
          }
        } catch (err) {
          console.error("Error cleaning up event listener:", err);
        }
      };
    } catch (error) {
      console.error("Error in MetaMask initialization:", error);
      setIsMetaMaskInstalled(false);
      setError("Failed to initialize MetaMask");
    }
  }, []);

  // Connect to MetaMask
  const connect = async (): Promise<string | null> => {
    if (!isMetaMaskInstalled) {
      setError("MetaMask is not installed");
      return null;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        return accounts[0];
      }
      return null;
    } catch (err) {
      console.error("Error connecting to MetaMask:", err);
      setError("Failed to connect to MetaMask");
      return null;
    }
  };

  return {
    isMetaMaskInstalled,
    isConnected,
    account,
    connect,
    error,
  };
};
