import jwt, { Jwt } from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import { Admin, AdminRole } from '../models/Admin.js';
import { Session } from '../models/Session.js';
import { redisClient } from '../config/redis.js';
import { publishToQueue } from '../config/rabbitmq.js';

export class AuthController {
  static async login(email: string, password: string, twoFactorCode: string | undefined, context: any) {
    const admin = await Admin.findOne({ email });
    const req = context.req || context;
    const ipAddress = req?.ip || req?.connection?.remoteAddress || req?.socket?.remoteAddress || 'unknown';
    const userAgent = req?.headers?.['user-agent'] || req?.get?.('user-agent') || 'unknown';

    const logActivity = (status: string, reason?: string, adminId?: any) => {
      publishToQueue('auth_logs', {
        adminId, email, ipAddress, userAgent, status, reason, timestamp: new Date()
      }).catch(err => console.error('Failed to log activity:', err));
    };

    if (!admin || !admin.isActive) {
      logActivity('FAILED', 'Invalid credentials');
      throw new Error('Invalid credentials');
    }

    const isValid = await admin.comparePassword(password);
    if (!isValid) {
      logActivity('FAILED', 'Invalid password', admin._id);
      throw new Error('Invalid credentials');
    }

    if (admin.twoFactorEnabled && !twoFactorCode) {
      return {
        requiresTwoFactor: true,
        accessToken: '',
        refreshToken: '',
        admin: null
      };
    }

    if (admin.twoFactorEnabled && twoFactorCode) {
      const verified = speakeasy.totp.verify({
        secret: admin.twoFactorSecret!,
        encoding: 'base32',
        token: twoFactorCode,
        window: 2
      });

      if (!verified) {
        logActivity('FAILED', '2FA verification failed', admin._id);
        throw new Error('Invalid 2FA code');
      }
    }

    const accessToken = jwt.sign(
      { adminId: admin._id, role: admin.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } as jwt.SignOptions
    );

    const refreshToken = jwt.sign(
      { adminId: admin._id },
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' } as jwt.SignOptions
    );
      await context.res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
    await Session.create({
      adminId: admin._id,
      refreshToken,
      ipAddress,
      userAgent,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    admin.lastLogin = new Date();
    await admin.save();

    logActivity('SUCCESS', undefined, admin._id);

    return { accessToken, refreshToken, admin, requiresTwoFactor: false };
  }

  static async refreshToken(refreshToken: string) {
    const session = await Session.findOne({ refreshToken });
    if (!session || session.expiresAt < new Date()) {
      throw new Error('Invalid refresh token');
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
    const admin = await Admin.findById(decoded.adminId);

    if (!admin || !admin.isActive) {
      throw new Error('Invalid session');
    }

    const accessToken = jwt.sign(
      { adminId: admin._id, role: admin.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } as jwt.SignOptions
    );

    return { accessToken, refreshToken, admin, requiresTwoFactor: false };
  }

  static async logout(user: any, token: string | undefined) {
    if (token) {
      try {
        await redisClient.setEx(`blacklist:${token}`, 900, 'true');
      } catch (error) {
        console.warn('Redis unavailable, skipping token blacklist');
      }
    }

    await Session.deleteMany({ adminId: user._id });
    return true;
  }
}
