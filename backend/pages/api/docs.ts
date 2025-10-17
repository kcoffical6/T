import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/database';
import { corsMiddleware } from '@/middleware/cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await corsMiddleware(req, res);

  if (req.method === 'GET') {
    try {
      await connectDB();
      
      res.status(200).json({
        name: 'XYZ Tours and Travels API',
        version: '1.0.0',
        description: 'Modern tours and travels platform for South India',
        endpoints: {
          auth: {
            login: 'POST /api/auth/login',
            signup: 'POST /api/auth/signup',
            refresh: 'POST /api/auth/refresh',
            logout: 'POST /api/auth/logout',
            profile: 'POST /api/auth/profile'
          },
          packages: {
            list: 'GET /api/packages',
            bySlug: 'GET /api/packages/[slug]',
            featured: 'GET /api/packages/featured',
            byRegion: 'GET /api/packages/region/[region]'
          },
          users: {
            list: 'GET /api/users',
            profile: 'PUT /api/users/profile',
            passengers: 'PUT /api/users/passengers',
            byRole: 'GET /api/users/role/[role]'
          },
          health: 'GET /api/health'
        },
        documentation: '/api/docs'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get API info' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
