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

      const { slug } = req.query;

      if (!slug || typeof slug !== 'string') {
        return res.status(400).json({ error: 'Slug is required' });
      }

      const packageData = await packagesService.findBySlug(slug);

      if (!packageData) {
        return res.status(404).json({ error: 'Package not found' });
      }

      res.status(200).json(packageData);
    } catch (error) {
      console.error('Get package by slug error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
