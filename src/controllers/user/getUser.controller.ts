import { RequestHandler } from "express";
import { PagingQuery } from "@r5v/mongoose-paginate";
import User, { IUser } from "../../models/User";
import type { PagingQueryOptions } from "@r5v/mongoose-paginate/dist/types/types";
import { SUCCESS_MESSAGES } from "../../utils";

interface ReqParams extends PagingQueryOptions {}

interface ResBody extends IUser {}

interface ReqBody {}

export const getUserController: RequestHandler<ReqParams, ResBody, ReqBody> = async ( req, res, next ) => {
  try {
    const query = new PagingQuery(req, User, {
      sanitizeFilter: true,
      single: true
    })
    const response = await query.exec()

    res.json( response );
  }
  catch ( error ) {
    next( error );
  }
};