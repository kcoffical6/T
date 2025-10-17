import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/database';
import { corsMiddleware } from '@/middleware/cors';
import { verifyAccessToken, extractTokenFromRequest } from '@/lib/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await corsMiddleware(req, res);

  if (req.method === 'POST') {
    try {
      await connectDB();

      const token = extractTokenFromRequest(req);
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const payload = verifyAccessToken(token);
      
      res.status(200).json({ 
        message: 'Logout successful',
        user: {
          userId: payload.userId,
          email: payload.email,
          role: payload.role
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(401).json({ error: 'Invalid token' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
