import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/database";
import { corsMiddleware } from "@/middleware/cors";
import { AuthService } from "@/services/AuthService";

const authService = new AuthService();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await corsMiddleware(req, res);

  if (req.method === "POST") {
    try {
      await connectDB();

      const { name, email, phone, password, country } = req.body;

      if (!name || !email || !phone || !password || !country) {
        return res.status(400).json({ error: "All fields are required" });
      }

      if (password.length < 8) {
        return res
          .status(400)
          .json({ error: "Password must be at least 8 characters long" });
      }

      const authResponse = await authService.signup({
        name,
        email,
        phone,
        password,
        country,
      });

      res.status(201).json(authResponse);
    } catch (error) {
      console.error("Signup error:", error);
      if (error instanceof Error && error.message.includes("already exists")) {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
