import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER'
}

export interface IAdmin extends Document {
  email: string;
  password: string;
  role: AdminRole;
  firstName: string;
  lastName: string;
  isActive: boolean;
  twoFactorSecret?: string;
  twoFactorEnabled: boolean;
  lastLogin?: Date;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const adminSchema = new Schema<IAdmin>({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String},
  role: { type: String, enum: Object.values(AdminRole), default: AdminRole.MANAGER },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  twoFactorSecret: String,
  twoFactorEnabled: { type: Boolean, default: false },
  lastLogin: Date,
  createdBy: { type: Schema.Types.ObjectId, ref: 'Admin' }
}, { timestamps: true });

adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

adminSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const Admin = mongoose.model<IAdmin>('Admin', adminSchema);
