import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/database';
import { corsMiddleware } from '@/middleware/cors';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';
import { UsersService } from '@/services/UsersService';

const usersService = new UsersService();

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  await corsMiddleware(req, res);

  if (req.method === 'GET') {
    try {
      await connectDB();

      const { role } = req.query;

      if (!role) {
        return res.status(400).json({ error: 'Role parameter is required' });
      }

      const users = await usersService.getUsersByRole(role as string);

      res.status(200).json({ users });
    } catch (error) {
      console.error('Get users by role error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withAuth(handler);
