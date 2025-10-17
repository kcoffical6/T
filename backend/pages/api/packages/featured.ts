import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/database';
import { corsMiddleware } from '@/middleware/cors';
import { PackagesService } from '@/services/PackagesService';

const packagesService = new PackagesService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await corsMiddleware(req, res);

  if (req.method === 'GET') {
    try {
      await connectDB();

      const limit = parseInt(req.query.limit as string) || 6;
      const packages = await packagesService.getFeaturedPackages(limit);

      res.status(200).json({ packages });
    } catch (error) {
      console.error('Get featured packages error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
