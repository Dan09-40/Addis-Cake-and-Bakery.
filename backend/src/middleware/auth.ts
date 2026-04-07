import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    isAdmin: boolean;
    isDriver?: boolean;
  };
}

// Middleware to protect routes (require authentication)
export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    
    req.user = {
      id: decoded.id,
      isAdmin: decoded.isAdmin,
      isDriver: decoded.isDriver || false
    };
    
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check if user is admin
export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

// Middleware to check if user is driver
export const driver = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || (!req.user.isDriver && !req.user.isAdmin)) {
    return res.status(403).json({ message: 'Access denied. Delivery staff only.' });
  }
  next();
};

export default protect;
