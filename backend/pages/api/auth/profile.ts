import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/database';
import { corsMiddleware } from '@/middleware/cors';
import { verifyAccessToken, extractTokenFromRequest } from '@/lib/jwt';
import { User } from '@/models/User';

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
      const user = await User.findById(payload.userId).select('-passwordHash');
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          country: user.country,
          role: user.role,
          savedPassengers: user.savedPassengers,
          isActive: user.isActive,
          lastLoginAt: user.lastLoginAt,
          emailVerifiedAt: user.emailVerifiedAt,
          phoneVerifiedAt: user.phoneVerifiedAt,
        }
      });
    } catch (error) {
      console.error('Profile error:', error);
      res.status(401).json({ error: 'Invalid token' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
