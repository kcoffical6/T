import { NextApiResponse } from "next";
import { AuthenticatedRequest } from "@/types/auth";
import { connectDB } from "@/lib/database";
import { corsMiddleware } from "@/middleware/cors";
import { withRole } from "@/middleware/auth";
import { UsersService } from "@/services/UsersService";
import Role from "./role/[role]";

const usersService = new UsersService();

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  await corsMiddleware(req, res);

  if (req.method === "GET") {
    try {
      await connectDB();

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await usersService.getAllUsers(page, limit);

      res.status(200).json(result);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Wrap the handler with the role-based middleware
export default async function protectedHandler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  return new Promise<void>((resolve) => {
    // Convert Next.js API route to Express-style middleware
    const middleware = withRole(["admin"]);

    // @ts-ignore - Type mismatch between Express and Next.js types
    middleware(req, res, (result: any) => {
      if (result instanceof Error) {
        return res.status(500).json({ error: result.message });
      }
      return handler(req, res);
    });
  });
}
