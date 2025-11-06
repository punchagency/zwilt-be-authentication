import { RequestHandler } from "express";
import {

  SUCCESS_MESSAGES,

} from "../../utils/constants";
import { BadRequest, Unauthorized } from "http-errors";

interface ReqParams {}

interface ReqBody {}

interface ResBody {
  message: string;
}

// ============================================================================
// LOGOUT CONTROLLER
// ============================================================================

/**
 * Logout user (client-side token removal)
 */
export const logoutController: RequestHandler<ReqParams, ResBody, ReqBody> = async ( req, res ) => {
  res.json( {
              message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
            } );
};

