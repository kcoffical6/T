import { NextApiRequest, NextApiResponse } from "next";
import {
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  toggleVehicleAvailability,
} from "@/controllers/vehicleController";
import { withRole } from "@/middleware/auth";
import { adaptExpressRoute } from "@/lib/expressAdapter";
import { JWTPayload } from "@/lib/jwt";

// Extend the NextApiRequest type to include the user property
type NextApiRequestWithUser = NextApiRequest & {
  user?: JWTPayload;
};

const handler = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      return adaptExpressRoute(getVehicleById)(req, res);
    case "PUT":
      return adaptExpressRoute(updateVehicle)(req, res);
    case "DELETE":
      return adaptExpressRoute(deleteVehicle)(req, res);
    case "PATCH":
      // Handle availability toggle
      if (req.query.action === "toggle-availability") {
        return adaptExpressRoute(toggleVehicleAvailability)(req, res);
      }
      return res.status(400).json({ message: "Invalid action" });
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE", "PATCH"]);
      return res.status(405).json({ error: "Method not allowed" });
  }
};

// Apply the auth middleware to the handler
// Wrap the handler with the role-based middleware
export default async function protectedHandler(
  req: NextApiRequestWithUser,
  res: NextApiResponse
) {
  return new Promise<void>((resolve) => {
    // Convert Next.js API route to Express-style middleware
    const middleware = withRole(["admin", "super_admin"]);

    // @ts-ignore - Type mismatch between Express and Next.js types
    middleware(req, res, (result: any) => {
      if (result instanceof Error) {
        return res.status(500).json({ error: result.message });
      }
      return handler(req, res);
    });
  });
}
