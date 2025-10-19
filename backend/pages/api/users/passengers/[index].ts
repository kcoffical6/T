import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/database";
import { corsMiddleware } from "@/middleware/cors";
import { withRole } from "@/middleware/auth";
import { AuthenticatedRequest } from "@/types/auth";
import { UsersService } from "@/services/UsersService";

const usersService = new UsersService();

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  await corsMiddleware(req, res);

  if (req.method === "DELETE") {
    try {
      await connectDB();

      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "User ID not found" });
      }

      const { index } = req.query;
      const passengerIndex = parseInt(index as string);

      if (isNaN(passengerIndex)) {
        return res.status(400).json({ error: "Invalid passenger index" });
      }

      const user = await usersService.removeSavedPassenger(
        userId,
        passengerIndex
      );

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Remove passenger error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
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
    const middleware = withRole(["user"]);

    // @ts-ignore - Type mismatch between Express and Next.js types
    middleware(req, res, (result: any) => {
      if (result instanceof Error) {
        return res.status(500).json({ error: result.message });
      }
      return handler(req, res);
    });
  });
}
