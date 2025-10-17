import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/database";
import { corsMiddleware } from "@/middleware/cors";
import { AuthService } from "@/services/AuthService";
import { verifyAccessToken, extractTokenFromRequest } from "@/lib/jwt";

const authService = new AuthService();

// Enable body parsing
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await corsMiddleware(req, res);

  if (req.method === "POST") {
    try {
      await connectDB();

      const { email, password } = req.body;
      console.log("Login request body:", {
        email,
        passwordProvided: !!password,
      });

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const user = await authService.validateUser(email, password);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const authResponse = await authService.login(user);

      res.status(200).json(authResponse);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
