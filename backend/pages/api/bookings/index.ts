import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/database';
import { corsMiddleware } from '@/middleware/cors';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';
import { Booking } from '@/models/Booking';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  await corsMiddleware(req, res);

  if (req.method === 'GET') {
    try {
      await connectDB();

      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'User ID not found' });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const [bookings, total] = await Promise.all([
        Booking.find({ userId })
          .populate('packageId', 'title slug basePricePerPax images')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Booking.countDocuments({ userId })
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
      console.error('Get bookings error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      await connectDB();

      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'User ID not found' });
      }

      const { packageId, passengers, travelDate, specialRequests } = req.body;

      if (!packageId || !passengers || !travelDate) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Calculate total amount (simplified - in real app, you'd fetch package price)
      const totalAmount = passengers.length * 1000; // Placeholder calculation

      const booking = new Booking({
        userId,
        packageId,
        passengers,
        totalAmount,
        bookingDate: new Date(),
        travelDate: new Date(travelDate),
        specialRequests
      });

      await booking.save();

      res.status(201).json(booking);
    } catch (error) {
      console.error('Create booking error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withAuth(handler);
