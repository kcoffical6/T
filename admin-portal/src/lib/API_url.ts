// This file handles API URLs in a way that works in both client and server components

// For client-side, use the public URL from environment variables
const getPublicApiUrl = () => {
  // In the browser, we can safely access the window object
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  }

  // For server-side, use the environment variable directly
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
};

export const PUBLIC_API_URL = getPublicApiUrl();
export const auth_URL = `${getPublicApiUrl()}/api/auth`;
