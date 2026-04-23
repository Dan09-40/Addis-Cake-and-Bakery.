import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { IUser } from '../models/User';

// Generate JWT Token
const generateToken = (userId: string, isAdmin: boolean, isDriver: boolean = false): string => {
  return jwt.sign(
    { id: userId, isAdmin, isDriver },
    process.env.JWT_SECRET || 'default-secret-key',
    { expiresIn: '30d' }
  );
};

// Register new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Validate input
    if (!name || !email || !password || !phone || !address) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User with this email already exists' });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      isAdmin: false
    });

    await newUser.save();

    // Generate token
    const token = generateToken(newUser._id.toString(), newUser.isAdmin, newUser.isDriver);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        isDriver: newUser.isDriver
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    // Find user
    console.log(`Login attempt for email: ${email}`);
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Generate token
    const token = generateToken(user._id.toString(), user.isAdmin, user.isDriver);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isDriver: user.isDriver
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get current user profile
export const getProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
export const updateProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const { name, phone, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { name, phone, address },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
