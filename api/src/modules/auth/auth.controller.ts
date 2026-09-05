import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';

export const loginHandler = (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Standard demo login verification
  if (email === 'demo@pulsewatch.dev' || !email) {
    const tokens = AuthService.getDemoUser();
    return res.json(tokens);
  }

  const userPayload = {
    id: `user-${Date.now()}`,
    email,
    name: email.split('@')[0],
  };

  const tokens = AuthService.generateTokens(userPayload);
  return res.json(tokens);
};

export const registerHandler = (req: Request, res: Response) => {
  const { email, name } = req.body;
  const userPayload = {
    id: `user-${Date.now()}`,
    email: email || 'user@pulsewatch.dev',
    name: name || 'Market Investor',
  };

  const tokens = AuthService.generateTokens(userPayload);
  return res.status(201).json(tokens);
};

export const logoutHandler = (req: Request, res: Response) => {
  return res.json({ message: 'Successfully logged out' });
};
