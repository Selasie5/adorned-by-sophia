import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  adminId: mongoose.Types.ObjectId;
  refreshToken: string;
  ipAddress: string;
  userAgent: string;
  expiresAt: Date;
  createdAt: Date;
}

const sessionSchema = new Schema<ISession>({
  adminId: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
  refreshToken: { type: String, required: true, unique: true },
  ipAddress: { type: String, required: true },
  userAgent: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session = mongoose.model<ISession>('Session', sessionSchema);
