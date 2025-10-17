import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/database';
import { corsMiddleware } from '@/middleware/cors';
import { AuthService } from '@/services/AuthService';

const authService = new AuthService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await corsMiddleware(req, res);

  if (req.method === 'POST') {
    try {
      await connectDB();

      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token is required' });
      }

      const authResponse = await authService.refreshToken(refreshToken);

      res.status(200).json(authResponse);
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(401).json({ error: 'Invalid refresh token' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
