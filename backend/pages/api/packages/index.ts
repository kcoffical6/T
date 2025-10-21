import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/database";
import { corsMiddleware } from "@/middleware/cors";
import { PackagesService } from "@/services/PackagesService";

const packagesService = new PackagesService();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await corsMiddleware(req, res);

  if (req.method === "GET") {
    try {
      await connectDB();

      const filters = {
        region: req.query.region as string,
        minPrice: req.query.minPrice
          ? parseInt(req.query.minPrice as string)
          : undefined,
        maxPrice: req.query.maxPrice
          ? parseInt(req.query.maxPrice as string)
          : undefined,
        minPax: req.query.minPax
          ? parseInt(req.query.minPax as string)
          : undefined,
        featured: req.query.featured
          ? req.query.featured === "true"
          : undefined,
        search: req.query.search as string,
      };

      const pagination = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
      };

      const result = await packagesService.findAll(filters, pagination);

      res.status(200).json(result);
    } catch (error) {
      console.error("Get packages error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
