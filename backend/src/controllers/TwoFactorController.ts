import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { redisClient } from '../config/redis.js';

export class TwoFactorController {
  static async setupTwoFactor(user: any) {
    const secret = speakeasy.generateSecret({
      name: `Adorned by Sophia (${user.email})`,
      length: 32
    });

    await redisClient.setEx(`2fa:${user._id}`, 600, secret.base32);

    const qrCode = await qrcode.toDataURL(secret.otpauth_url!);

    return { secret: secret.base32, qrCode };
  }

  static async enableTwoFactor(user: any, code: string) {
    const secret = await redisClient.get(`2fa:${user._id}`);
    if (!secret) throw new Error('Setup session expired');

    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: code,
      window: 2
    });

    if (!verified) throw new Error('Invalid code');

    user.twoFactorSecret = secret;
    user.twoFactorEnabled = true;
    await user.save();

    await redisClient.del(`2fa:${user._id}`);

    return true;
  }

  static async disableTwoFactor(user: any, password: string) {
    const isValid = await user.comparePassword(password);
    if (!isValid) throw new Error('Invalid password');

    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    await user.save();

    return true;
  }
}
