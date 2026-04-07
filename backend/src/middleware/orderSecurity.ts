import { Response, NextFunction } from 'express';
import { Order } from '../models/Order';
import { AuthRequest } from './auth';

const MAX_PENDING_ORDERS = 3; // Max unpaid/pending orders per user

// Block scammers: Prevent placing more than MAX_PENDING_ORDERS unpaid orders
export const checkPendingOrderLimit = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id || req.body.user;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required to place an order.' });
    }

    // Count how many pending/unpaid orders this user already has
    const pendingCount = await Order.countDocuments({
      user: userId,
      status: { $in: ['pending', 'processing'] },
      isPaid: false
    });

    if (pendingCount >= MAX_PENDING_ORDERS) {
      return res.status(429).json({
        message: `You have ${pendingCount} unpaid orders. Please complete payment before placing new orders.`,
        pendingOrders: pendingCount
      });
    }

    next();
  } catch (error) {
    console.error('Order security check error:', error);
    res.status(500).json({ message: 'Security check failed' });
  }
};

export default checkPendingOrderLimit;
