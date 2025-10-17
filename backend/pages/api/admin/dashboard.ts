import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/database';
import { corsMiddleware } from '@/middleware/cors';
import { withRole, AuthenticatedRequest } from '@/middleware/auth';
import { User } from '@/models/User';
import { Package } from '@/models/Package';
import { Booking } from '@/models/Booking';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  await corsMiddleware(req, res);

  if (req.method === 'GET') {
    try {
      await connectDB();

      const [
        totalUsers,
        totalPackages,
        totalBookings,
        pendingBookings,
        activeUsers,
        featuredPackages
      ] = await Promise.all([
        User.countDocuments(),
        Package.countDocuments(),
        Booking.countDocuments(),
        Booking.countDocuments({ status: 'pending' }),
        User.countDocuments({ isActive: true }),
        Package.countDocuments({ featured: true, isActive: true })
      ]);

      const recentBookings = await Booking.find()
        .populate('userId', 'name email')
        .populate('packageId', 'title')
        .sort({ createdAt: -1 })
        .limit(5);

      const stats = {
        overview: {
          totalUsers,
          totalPackages,
          totalBookings,
          pendingBookings,
          activeUsers,
          featuredPackages
        },
        recentBookings
      };

      res.status(200).json(stats);
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withRole(['admin', 'super_admin'])(handler);
