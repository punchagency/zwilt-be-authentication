import bcrypt from "bcrypt";
import { IUser } from "../../User";

export const comparePassword = async function (
  this: IUser, candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};