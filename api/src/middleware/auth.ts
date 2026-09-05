import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { UserPayload } from '../types/index.js';

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // For demo simplicity, fallback to default demo user if token is missing
    req.user = {
      id: 'demo-user-id-groww-2026',
      email: 'demo@pulsewatch.dev',
      name: 'Groww Demo Investor',
    };
    return next();
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret) as UserPayload;
    req.user = payload;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};
