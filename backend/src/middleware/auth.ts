import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { GraphQLError } from 'graphql';
import { redisClient } from '../config/redis.js';
import { Admin } from '../models/Admin.js';

interface JWTPayload {
  adminId: string;
  role: string;
}

export const authenticate = async (req: Request) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) return null;

  try {
    const blacklisted = await redisClient.get(`blacklist:${token}`);
    if (blacklisted) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    const admin = await Admin.findById(decoded.adminId);
    
    if (!admin || !admin.isActive) return null;
    
    return admin;
  } catch (error) {
    return null;
  }
};

export const requireAuth = (user: any) => {
  if (!user) {
    throw new GraphQLError('Authentication required', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
};

export const requireRole = (user: any, roles: string[]) => {
  requireAuth(user);
  if (!roles.includes(user.role)) {
    throw new GraphQLError('Insufficient permissions', {
      extensions: { code: 'FORBIDDEN' },
    });
  }
};
