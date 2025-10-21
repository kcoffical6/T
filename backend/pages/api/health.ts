import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/database";
import { corsMiddleware } from "@/middleware/cors";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await corsMiddleware(req, res);

  if (req.method === "GET") {
    try {
      await connectDB();

      res.status(200).json({
        message: "XYZ Tours API Health Check",
        status: "healthy",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        environment: process.env.NODE_ENV || "development",
      });
    } catch (error) {
      res.status(500).json({
        message: "Health check failed",
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
