import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { UserRole, USER_ROLES, AUTH } from "../utils";
import { preSetPasswordHook } from "./user/middleware/pre_setPassword.middleware";
import { comparePassword } from "./user/methods/comparePassword.method";



// ============================================================================
// TYPES
// ============================================================================

/**
 * User document interface
 */
export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  role: UserRole;
  isSuperuser: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// ============================================================================
// CONSTANTS
// ============================================================================



// ============================================================================
// SCHEMA
// ============================================================================

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: AUTH.MIN_PASSWORD_LENGTH,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
    },
    isSuperuser: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ============================================================================
// MIDDLEWARE
// ============================================================================


userSchema.pre('save', preSetPasswordHook);

// ============================================================================
// METHODS
// ============================================================================

/**
 * Compare provided password with hashed password
 */
userSchema.methods.comparePassword = comparePassword;

// ============================================================================
// PLUGINS
// ============================================================================


// ============================================================================
// MODEL
// ============================================================================

const User = mongoose.model<IUser>('User', userSchema);

export default User;
