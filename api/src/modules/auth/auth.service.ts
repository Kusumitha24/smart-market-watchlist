import jwt from 'jsonwebtoken';
import { config } from '../../config/index.js';
import { UserPayload } from '../../types/index.js';

export class AuthService {
  public static generateTokens(user: UserPayload) {
    const accessToken = jwt.sign(user, config.jwtSecret, { expiresIn: '7d' });
    const refreshToken = jwt.sign({ id: user.id }, config.jwtRefreshSecret, { expiresIn: '30d' });

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  public static getDemoUser() {
    const demoUser: UserPayload = {
      id: 'demo-user-id-groww-2026',
      email: 'demo@pulsewatch.dev',
      name: 'Groww Demo Investor',
    };
    return this.generateTokens(demoUser);
  }
}
