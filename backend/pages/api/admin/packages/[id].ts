import { NextApiRequest, NextApiResponse } from "next";
import { withRole } from "@/middleware/auth";
import { corsMiddleware } from "@/middleware/cors";
import { connectDB } from "@/lib/database";
import { adaptExpressRoute } from "@/lib/expressAdapter";
import { adminGetPackageById, adminUpdatePackage, adminDeletePackage } from "@/controllers/packageController";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await corsMiddleware(req, res);
  await connectDB();

  switch (req.method) {
    case "GET":
      return adaptExpressRoute(adminGetPackageById)(req, res);
    case "PUT":
      return adaptExpressRoute(adminUpdatePackage)(req, res);
    case "DELETE":
      return adaptExpressRoute(adminDeletePackage)(req, res);
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default async function protectedHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return new Promise<void>(() => {
    const middleware = withRole(["admin", "super_admin"]);
    // @ts-ignore
    middleware(req, res, (result: any) => {
      if (result instanceof Error) {
        return res.status(500).json({ error: result.message });
      }
      return handler(req, res);
    });
  });
}
