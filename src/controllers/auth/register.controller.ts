import { Request, RequestHandler, Response } from "express";
import User from "../../models/User";
import {
  generateToken,
  formatUserResponse,
  isValidPassword,
} from "../../utils/helpers";
import {
  AUTH,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  USER_ROLES,
} from "../../utils/constants";
import { BadRequest, Conflict } from "http-errors";

// ============================================================================
// REGISTER CONTROLLER
// ============================================================================

/**
 * Register a new user
 */

interface ReqParams {}

interface ReqBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
  isSuperuser?: boolean;
}

interface ResBody {}

export const registerController: RequestHandler<{}, ResBody, ReqBody> = async ( req, res, next ) => {
  try {
    const { email, password, firstName, lastName, role, isSuperuser } = req.body;

    // Validation
    if ( !email || !password || !firstName || !lastName ) {
      throw new BadRequest( ERROR_MESSAGES.ALL_FIELDS_REQUIRED );
    }

    if ( !isValidPassword( password ) ) {
      throw new BadRequest( ERROR_MESSAGES.PASSWORD_WEAK );
    }

    // Check if user already exists
    const existingUser = await User.exists( { email: email.toLowerCase() } );
    if ( existingUser ) {
      throw new Conflict( ERROR_MESSAGES.USER_EXISTS );
    }

    // Create new user
    // utilize User.create() to create a new user
    // set default roles in model
    const user = new User( {
                             email: email.toLowerCase(),
                             password, // hashed password?
                             firstName,
                             lastName,
                             role: role || USER_ROLES.USER,
                             isSuperuser: isSuperuser || false,
                           } );

    await user.save();

    // Generate JWT token
    const token = generateToken( ( user._id as any ).toString() );

    res.status( HTTP_STATUS.CREATED ).json( {
                                              success: true,
                                              message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS,
                                              data: {
                                                user: formatUserResponse( user ),
                                                token,
                                              },
                                            } );
  }
  catch ( error: any ) {
    console.error( "Registration error:", error ); //log error to console using logger
    next( error ); // pass error to the error handler middleware/dump at end of app
    /*     if ( error.code === 11000 ) {
     res.status( HTTP_STATUS.CONFLICT ).json( {
     success: false,
     message: ERROR_MESSAGES.USER_EXISTS,
     } );
     return;
     }

     res.status( HTTP_STATUS.INTERNAL_SERVER_ERROR ).json( {
     success: false,
     message: ERROR_MESSAGES.INTERNAL_ERROR,
     } );

     */
  }
};