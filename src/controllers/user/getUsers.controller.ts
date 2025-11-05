import { RequestHandler } from "express";
import { PagingQuery } from "@r5v/mongoose-paginate";
import User from "../../models/User";
import type { PagingQueryOptions } from "@r5v/mongoose-paginate/dist/types/types";

interface ReqParams extends PagingQueryOptions {}

interface ResParams {}

interface ReqParams {}

export const getUsersController: RequestHandler = async ( req, res, next ) => {
  try {
    const query = new PagingQuery(req, User, {
      sanitizeFilter: true,
    })
    const response = await query.exec()
    res.json( response );
  }
  catch ( error ) {
    next( error );
  }
};