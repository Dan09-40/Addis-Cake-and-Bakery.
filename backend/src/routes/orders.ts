import { Router } from 'express';
import { Order } from '../models/Order';
import { Cake } from '../models/Cake';
import { io } from '../index';
import protect, { admin } from '../middleware/auth';
import { checkPendingOrderLimit } from '../middleware/orderSecurity';

const router = Router();

// Create new order — requires login + security check
router.post('/', protect, checkPendingOrderLimit, async (req: any, res) => {
  try {
    const { orderItems, shippingAddr, deliveryDate } = req.body;
    const userId = req.user.id; // Always use authenticated user's ID (not from body)

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    // Server-side price recalculation (never trust client price)
    let totalPrice = 0;
    const validatedItems = [];

    for (const item of orderItems) {
      const cake = await Cake.findById(item.cake);
      if (!cake) {
        return res.status(400).json({ message: `Product not found: ${item.cake}` });
      }
      if (!cake.available) {
        return res.status(400).json({ message: `Product is currently unavailable: ${cake.name}` });
      }
      if (item.quantity < 1 || item.quantity > 100) {
        return res.status(400).json({ message: `Invalid quantity for ${cake.name}` });
      }
      totalPrice += cake.price * item.quantity;
      validatedItems.push({ cake: cake._id, quantity: item.quantity });
    }

    const order = new Order({
      user: userId,
      orderItems: validatedItems,
      shippingAddr,
      totalPrice,
      deliveryDate
    });

    const savedOrder = await order.save();

    // Populate user and cake info for the notification
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate('user', 'name email phone')
      .populate('orderItems.cake', 'name price');

    // 🔔 Emit real-time notification to Seller + Admin rooms
    io.to('sellers').emit('new_order', {
      orderId: savedOrder._id,
      customer: (populatedOrder?.user as any)?.name || 'Unknown',
      itemCount: validatedItems.length,
      totalPrice: totalPrice.toFixed(2),
      time: new Date().toISOString()
    });

    io.to('admins').emit('new_order', {
      orderId: savedOrder._id,
      customer: (populatedOrder?.user as any)?.name || 'Unknown',
      itemCount: validatedItems.length,
      totalPrice: totalPrice.toFixed(2),
      time: new Date().toISOString()
    });

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: 'Error creating order', error });
  }
});

// Get all orders (admin/seller only)
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .populate('orderItems.cake', 'name price image')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
});

// Get user's orders (authenticated)
router.get('/user/:userId', protect, async (req: any, res) => {
  try {
    // Users can only see their own orders unless they're admin
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const orders = await Order.find({ user: req.params.userId })
      .populate('user', 'name email')
      .populate('orderItems.cake', 'name price image');
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
});

// Get single order
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.cake', 'name price image');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
});

// Update order status (admin/seller)
router.put('/:id', protect, admin, async (req: any, res) => {
  try {
    const { status, isPaid } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(isPaid !== undefined && { isPaid }) },
      { new: true }
    ).populate('user', 'name email');

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // 🔔 Notify the delivery team when order is ready for pickup
    if (status === 'processing') {
      io.to('delivery').emit('delivery_assigned', {
        orderId: updatedOrder._id,
        customer: (updatedOrder.user as any)?.name,
        status: 'processing',
        time: new Date().toISOString()
      });
    }

    // 🔔 Notify the customer when order is delivered
    if (status === 'delivered') {
      io.to(`customer_${(updatedOrder.user as any)?._id}`).emit('order_delivered', {
        orderId: updatedOrder._id,
        message: 'Your order has been delivered! 🎉',
        time: new Date().toISOString()
      });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: 'Error updating order', error });
  }
});

// Update order payment status (admin only) — legacy route
router.put('/:id/payment', protect, admin, async (req, res) => {
  try {
    const { isPaid } = req.body;
    
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { isPaid },
      { new: true }
    );
    
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: 'Error updating order payment status', error });
  }
});

export default router;
