
// ============================================================================
// PROFILE CONTROLLER
// ============================================================================

import { RequestHandler } from "express";

/**
 * Get current user profile
 */
interface ReqParams {}
interface ReqBody {}
interface ResBody {}

export const getProfileController: RequestHandler<ReqParams, ReqBody, ResBody> = (req, res, next) => {
  try {
    const user = req.user;

    res.json( user );
  }
  catch ( error ) {
    console.error( 'Profile error:', error );
    next( error );

  }
}