import { Request, RequestHandler, Response } from "express";
import User, { IUser } from "../../models/User";
import {
  generateToken,
} from "../../utils/helpers";
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,

} from "../../utils/constants";
import { BadRequest, Unauthorized } from "http-errors";

// ============================================================================
// LOGIN CONTROLLER
// ============================================================================


/**
 * Authenticate user and return token
 */
interface ReqParams {}

interface ReqBody {
  email: string;
  password: string;
}

interface ResBody {
  message: string;
  data: {
    user:IUser,
    token: string;
  };
}

export const loginController: RequestHandler<ReqParams, ResBody, ReqBody> = async ( req, res, next ) => {
  try {
    const { email, password } = req.body;

    // Validation
    if ( !email || !password ) {
      throw new BadRequest( ERROR_MESSAGES.INVALID_CREDENTIALS );

    }

    // Find user
    const user = await User.findOne( { email: email.toLowerCase() } );
    if ( !user ) {
      throw new Unauthorized( ERROR_MESSAGES.INVALID_CREDENTIALS );
    }

    // Check if account is active
    if ( user && !user.isActive ) {
      throw new Unauthorized( ERROR_MESSAGES.ACCOUNT_DEACTIVATED );
    }

    // Check password
    const isPasswordValid = await user.comparePassword( password );
    if ( !isPasswordValid ) {
      throw new Unauthorized( ERROR_MESSAGES.INVALID_CREDENTIALS );
    }

    // Generate JWT token
    const token = generateToken( ( user._id as any ).toString() );

    res.json( {
                message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
                data: {
                  user:  user,
                  token,
                },
              } );
  }
  catch ( error ) {
    // log error to console using logger
    next( error );
  }
};
