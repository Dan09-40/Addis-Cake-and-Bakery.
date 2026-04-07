import { Router } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      address
    });

    const savedUser = await user.save();
    
    // Remove password from response
    const { password: _, ...userResponse } = savedUser.toObject();
    
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({ message: 'Error registering user', error });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    // Remove password from response
    const { password: _, ...userResponse } = user.toObject();
    
    res.json({
      token,
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

// Get user profile (protected route)
router.get('/profile', async (req: AuthRequest, res) => {
  try {
    // This would need auth middleware to get userId from token
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove password from response
    const { password: _, ...userResponse } = user.toObject();
    
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
});

export default router;
