import mongoose, { Schema, Document } from 'mongoose';

export interface ILoginActivity extends Document {
  adminId: mongoose.Types.ObjectId;
  email: string;
  ipAddress: string;
  userAgent: string;
  status: 'SUCCESS' | 'FAILED' | 'BLOCKED';
  reason?: string;
  timestamp: Date;
}

const loginActivitySchema = new Schema<ILoginActivity>({
  adminId: { type: Schema.Types.ObjectId, ref: 'Admin' },
  email: { type: String, required: true },
  ipAddress: { type: String, required: true },
  userAgent: { type: String, required: true },
  status: { type: String, enum: ['SUCCESS', 'FAILED', 'BLOCKED'], required: true },
  reason: String,
  timestamp: { type: Date, default: Date.now }
});

loginActivitySchema.index({ adminId: 1, timestamp: -1 });

export const LoginActivity = mongoose.model<ILoginActivity>('LoginActivity', loginActivitySchema);
