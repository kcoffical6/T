import { NextApiRequest, DefaultSession } from "next";

declare module "next" {
  interface NextApiRequestWithUser extends NextApiRequest {
    user?: {
      id: string;
      email: string;
      role: string;
    };
  }
}
