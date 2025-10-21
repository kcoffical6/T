import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/database";
import { corsMiddleware } from "@/middleware/cors";
import { withRole } from "@/middleware/auth";
import { Booking } from "@/models/Booking";
import { adaptExpressRoute } from "@/lib/expressAdapter";
import { adminCreateBooking } from "@/controllers/bookingController";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await corsMiddleware(req, res);

  if (req.method === "GET") {
    try {
      await connectDB();

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;
      const skip = (page - 1) * limit;

      const query: any = {};
      if (status) {
        query.status = status;
      }

      const [bookings, total] = await Promise.all([
        Booking.find(query)
          .populate("userId", "name email phone")
          .populate("packageId", "title slug basePricePerPax")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Booking.countDocuments(query),
      ]);

      res.status(200).json({
        bookings,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get admin bookings error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "POST") {
    try {
      await connectDB();
      return adaptExpressRoute(adminCreateBooking)(req, res);
    } catch (error) {
      console.error("Create admin booking error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Wrap the handler with the role-based middleware
export default async function protectedHandler(
  req: NextApiRequest,
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
