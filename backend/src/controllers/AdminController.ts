import { Admin, AdminRole } from '../models/Admin.js';
import { LoginActivity } from '../models/LoginActivity.js';
import { publishToQueue } from '../config/rabbitmq.js';
import { genPassword } from '../helpers/passwordGen.js';

export class AdminController {
  static async getAdmins(role?: AdminRole) {
    const filter = role ? { role } : {};
    return Admin.find(filter).sort({ createdAt: -1 });
  }

  static async createAdmin(data: any, createdBy: string) {
    const exists = await Admin.findOne({ email: data.email });
    if (exists) throw new Error('Email already exists');

    const plainPassword = await genPassword();
    const admin = await Admin.create({
      ...data,
      password: plainPassword,
      createdBy
    });

    publishToQueue('email_notifications', {
      to: data.email,
      subject: 'Admin Account Created',
      template: 'admin_created',
      data: { name: data.firstName, email: data.email, password: plainPassword }
    });

    return admin;
  }

  static async updateAdmin(id: string, updates: any) {
    const admin = await Admin.findByIdAndUpdate(id, updates, { new: true });
    if (!admin) throw new Error('Admin not found');
    return admin;
  }

  static async deleteAdmin(id: string, currentUserId: string) {
    if (id === currentUserId) {
      throw new Error('Cannot delete your own account');
    }

    await Admin.findByIdAndDelete(id);
    return true;
  }

  static async getLoginActivity(user: any, limit: number = 50) {
    const filter = user.role === AdminRole.SUPER_ADMIN 
      ? {} 
      : { adminId: user._id };
    return LoginActivity.find(filter).sort({ timestamp: -1 }).limit(limit);
  }
}
