import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/database';
import { corsMiddleware } from '@/middleware/cors';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';
import { UsersService } from '@/services/UsersService';

const usersService = new UsersService();

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  await corsMiddleware(req, res);

  if (req.method === 'PUT') {
    try {
      await connectDB();

      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'User ID not found' });
      }

      const passenger = req.body;
      const user = await usersService.addSavedPassenger(userId, passenger);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error('Add passenger error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withAuth(handler);
