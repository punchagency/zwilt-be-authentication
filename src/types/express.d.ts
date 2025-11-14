import { IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: Partial<IUser>;
      id?: string;
      log?: {
        startTimeMs?: number
        endTimeMs?: number
        duration?: number
        tracer?: string
      };
    }
  }
}
