import crypto from 'crypto';
import { Admin } from '../models/Admin.js';
import { PasswordReset } from '../models/PasswordReset.js';
import { Session } from '../models/Session.js';
import { sendEmail } from '../services/email.js';

export class PasswordController {
  static async requestPasswordReset(email: string) {
    const admin = await Admin.findOne({ email });
    if (!admin) return true;

    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    await PasswordReset.create({
      adminId: admin._id,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000)
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await sendEmail({
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Link expires in 1 hour.</p>`
    });

    return true;
  }

  static async resetPassword(token: string, newPassword: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const reset = await PasswordReset.findOne({
      token: hashedToken,
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!reset) throw new Error('Invalid or expired token');

    const admin = await Admin.findById(reset.adminId);
    if (!admin) throw new Error('Admin not found');

    admin.password = newPassword;
    await admin.save();

    reset.used = true;
    await reset.save();

    await Session.deleteMany({ adminId: admin._id });

    return true;
  }

  static async changePassword(user: any, currentPassword: string, newPassword: string) {
    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) throw new Error('Invalid current password');

    user.password = newPassword;
    await user.save();

    await Session.deleteMany({ adminId: user._id });

    return true;
  }
}
