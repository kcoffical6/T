import { NextApiRequest, NextApiResponse } from "next";
import {
  verifyAccessToken,
  extractTokenFromRequest,
  JWTPayload,
} from "@/lib/jwt";

export interface AuthenticatedRequest extends NextApiRequest {
  user?: JWTPayload;
}

export function withAuth(
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      const token = extractTokenFromRequest(req);

      if (!token) {
        return res.status(401).json({ error: "No token provided" });
      }

      const payload = verifyAccessToken(token);
      req.user = payload;

      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
}

export function withRole(roles: string[]) {
  return function (
    handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
  ) {
    return withAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
      if (!req.user) {
        return res.status(401).json({ error: "No user found" });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }

      return handler(req, res);
    });
  };
}
