import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/database';
import { corsMiddleware } from '@/middleware/cors';
import { withRole, AuthenticatedRequest } from '@/middleware/auth';
import { Booking } from '@/models/Booking';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  await corsMiddleware(req, res);

  if (req.method === 'GET') {
    try {
      await connectDB();

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;
      const skip = (page - 1) * limit;

      const query: any = {};
      if (status) {
        query.status = status;
      }

      const [bookings, total] = await Promise.all([
        Booking.find(query)
          .populate('userId', 'name email phone')
          .populate('packageId', 'title slug basePricePerPax')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Booking.countDocuments(query)
      ]);

      res.status(200).json({
        bookings,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Get admin bookings error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withRole(['admin', 'super_admin'])(handler);
