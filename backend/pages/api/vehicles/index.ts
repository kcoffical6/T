import { NextApiRequest, NextApiResponse } from "next";
import { getVehicles, createVehicle } from "@/controllers/vehicleController";
import { withRole } from "@/middleware/auth";
import { adaptExpressRoute } from "@/lib/expressAdapter";
import { JWTPayload } from "@/lib/jwt";

// Extend the NextApiRequest type to include the user property
type NextApiRequestWithUser = NextApiRequest & {
  user?: JWTPayload;
};

const handler = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case "GET":
        return adaptExpressRoute(getVehicles)(req, res);
      case "POST":
        // The withAuth middleware will handle authentication
        return adaptExpressRoute(createVehicle)(req, res);
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res
          .status(405)
          .json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error: any) {
    console.error("API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

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
