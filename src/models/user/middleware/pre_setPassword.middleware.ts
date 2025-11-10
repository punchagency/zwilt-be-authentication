import bcrypt from "bcrypt";
import {PreSaveMiddlewareFunction} from "mongoose";
import { IUser } from "../../User";

/**
 * Hash password before saving
 */

export const BCRYPT_SALT_ROUNDS = 12;

export const preSetPasswordHook: PreSaveMiddlewareFunction<IUser> =  async function preSetPassword(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
}