import mongoose, { Schema, Document } from "mongoose";

export interface ILoginActivity extends Document {
  adminId: mongoose.Types.ObjectId;
  email: string;
  ipAddress: string;
  userAgent: string;
  status: "SUCCESS" | "FAILED" | "BLOCKED";
  reason?: string;
  timestamp: Date;
}

const loginActivitySchema = new Schema<ILoginActivity>({
  adminId: { type: Schema.Types.ObjectId, ref: "Admin", immutable:true},
  email: { type: String, required: true, immutable:true },
  ipAddress: { type: String, required: true , immutable:true},
  userAgent: { type: String, required: true , immutable:true},
  status: {
    type: String,
    enum: ["SUCCESS", "FAILED", "BLOCKED"],
    required: true,
    immutable:true
  },
  reason: { type: String, immutable:true },
  timestamp: { type: Date, default: Date.now, immutable:true },
});

loginActivitySchema.index({ adminId: 1, timestamp: -1 });

export const LoginActivity = mongoose.model<ILoginActivity>(
  "LoginActivity",
  loginActivitySchema,
);
