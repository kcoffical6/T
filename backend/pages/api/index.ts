import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/database';
import { corsMiddleware } from '@/middleware/cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apply CORS middleware
  await corsMiddleware(req, res);

  if (req.method === 'GET') {
    try {
      await connectDB();
      res.status(200).json({ 
        message: 'XYZ Tours API is running!',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: 'Database connection failed' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
