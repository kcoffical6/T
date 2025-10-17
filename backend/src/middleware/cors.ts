import { NextApiRequest, NextApiResponse } from "next";
import dotenv from "dotenv";
dotenv.config();

console.log("process.env.CORS_ORIGIN", process.env.CORS_ORIGIN);
export function corsMiddleware(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>((resolve) => {
    // Get allowed origins from env and trim whitespace
    const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:4321")
      .split(",")
      .map((origin) => origin.trim());
    const origin = req.headers.origin || "";

    // Set CORS headers
    res.setHeader("Access-Control-Allow-Credentials", "true");

    // Check if origin is allowed and set appropriate header
    if (origin && allowedOrigins.includes(origin)) {
      // Origin is in the allowed list, use it
      res.setHeader("Access-Control-Allow-Origin", origin);
    } else if (origin) {
      // Origin not in list - log warning but allow in development
      console.warn(
        `CORS: Origin ${origin} not in allowed list: ${allowedOrigins.join(", ")}`
      );
      // In development, still allow the request by echoing the origin
      if (process.env.NODE_ENV === "development") {
        res.setHeader("Access-Control-Allow-Origin", origin);
      }
    } else {
      // No origin header, use first allowed origin
      res.setHeader("Access-Control-Allow-Origin", allowedOrigins[0]);
    }

    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,OPTIONS,PATCH,DELETE,POST,PUT"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
    );

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      res.status(200).end();
      resolve();
      return;
    }

    resolve();
  });
}
