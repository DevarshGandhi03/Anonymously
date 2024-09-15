import mongoose, { Document, Schema } from "mongoose";

export interface MessageInterface extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<MessageInterface> = new Schema({
  content: {
    type: String,
    trim: true,
    maxlength: 30,
    minlength: 5,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export interface UserInterface extends Document {
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  verifyToken: string;
  verifyTokenExpiry: number;
  forgetPasswordToken: string;
  forgetPasswordTokenExpiry: number;
  isAcceptingMessage: boolean;
  messages: MessageInterface[];
}

const UserSchema: Schema<UserInterface> = new Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  isVerified: Boolean,
  verifyToken: String,
  verifyTokenExpiry: Number,
  forgetPasswordToken: String,
  forgetPasswordTokenExpiry: Number,
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
});

const User =
  (mongoose.models.User as mongoose.Model<UserInterface>) ||
  mongoose.model<UserInterface>("User", UserSchema);
export default User;
