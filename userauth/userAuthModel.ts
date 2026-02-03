import mongoose, { Document, Schema } from "mongoose";

export interface UserAuth extends Document {
  userName: string;
  userEmail: string;
  userPassword: string;
  isEmailVerified: boolean;
  emailVerifyToken?: string;
  emailVerifyExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserAuth>(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },

    userEmail: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },

    userPassword: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerifyToken: {
      type: String,
    },

    emailVerifyExpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const userAuthModel = mongoose.model<UserAuth>(
  "UserAuth",
  userSchema
);
