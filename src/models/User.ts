import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { UserRole, USER_ROLES, AUTH } from '../utils/constants';

const mongoosePaginate = require('@r5v/mongoose-paginate');

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

const BCRYPT_SALT_ROUNDS = 12;

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

/**
 * Hash password before saving
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// ============================================================================
// METHODS
// ============================================================================

/**
 * Compare provided password with hashed password
 */
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// ============================================================================
// PLUGINS
// ============================================================================

if (mongoosePaginate && typeof mongoosePaginate === 'function') {
  userSchema.plugin(mongoosePaginate);
}

// ============================================================================
// MODEL
// ============================================================================

const User = mongoose.model<IUser>('User', userSchema);

export default User;
