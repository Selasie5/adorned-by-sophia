import { AdminRole } from '../models/Admin.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { AuthController } from '../controllers/AuthController.js';
import { AdminController } from '../controllers/AdminController.js';
import { TwoFactorController } from '../controllers/TwoFactorController.js';
import { PasswordController } from '../controllers/PasswordController.js';

export const resolvers = {
  Query: {
    me: async (_: any, __: any, { user }: any) => {
      requireAuth(user);
      return user;
    },

    getAdmins: async (_: any, { role }: { role?: AdminRole }, { user }: any) => {
      requireRole(user, [AdminRole.SUPER_ADMIN, AdminRole.ADMIN]);
      return AdminController.getAdmins(role);
    },

    getLoginActivity: async (_: any, { limit = 50 }: { limit?: number }, { user }: any) => {
      requireAuth(user);
      return AdminController.getLoginActivity(user, limit);
    }
  },

  Mutation: {
    login: async (_: any, { email, password, twoFactorCode }: any, context:any) => {
      return AuthController.login(email, password, twoFactorCode, context);
    },

    refreshToken: async (_: any, { refreshToken }: { refreshToken: string }) => {
      return AuthController.refreshToken(refreshToken);
    },

    logout: async (_: any, __: any, { user, req }: any) => {
      requireAuth(user);
      const token = req.headers.authorization?.replace('Bearer ', '');
      return AuthController.logout(user, token);
    },

    createAdmin: async (_: any, args: any, { user }: any) => {
      requireRole(user, [AdminRole.SUPER_ADMIN]);
      return AdminController.createAdmin(args, user._id);
    },

    updateAdmin: async (_: any, { id, ...updates }: any, { user }: any) => {
      requireRole(user, [AdminRole.SUPER_ADMIN, AdminRole.ADMIN]);
      return AdminController.updateAdmin(id, updates);
    },

    deleteAdmin: async (_: any, { id }: { id: string }, { user }: any) => {
      requireRole(user, [AdminRole.SUPER_ADMIN]);
      return AdminController.deleteAdmin(id, user._id.toString());
    },

    setupTwoFactor: async (_: any, __: any, { user }: any) => {
      requireAuth(user);
      return TwoFactorController.setupTwoFactor(user);
    },

    enableTwoFactor: async (_: any, { code }: { code: string }, { user }: any) => {
      requireAuth(user);
      return TwoFactorController.enableTwoFactor(user, code);
    },

    disableTwoFactor: async (_: any, { password }: { password: string }, { user }: any) => {
      requireAuth(user);
      return TwoFactorController.disableTwoFactor(user, password);
    },

    requestPasswordReset: async (_: any, { email }: { email: string }) => {
      return PasswordController.requestPasswordReset(email);
    },

    resetPassword: async (_: any, { token, newPassword }: any) => {
      return PasswordController.resetPassword(token, newPassword);
    },

    changePassword: async (_: any, { currentPassword, newPassword }: any, { user }: any) => {
      requireAuth(user);
      return PasswordController.changePassword(user, currentPassword, newPassword);
    }
  }
};
