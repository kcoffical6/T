import { NextApiRequest } from "next";

declare module "next" {
  interface NextApiRequest {
    user?: {
      id: string;
      role: string;
      // Add other user properties as needed
    };
  }
}

export interface AuthenticatedRequest extends NextApiRequest {
  user: {
    id: string;
    role: string;
    // Add other user properties as needed
  };
}
