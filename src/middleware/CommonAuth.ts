import { validateToken } from "./../utility";
import { Request, Response, NextFunction } from "express";
import { AuthPayload } from "../dto";

declare global {
  namespace Express {
    interface Request {
      //appending user field to resquest body, this is how we can append any field to req body
      user?: AuthPayload;
    }
  }
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isValidToken = await validateToken(req);
  if (isValidToken) {
    return next();
  } else {
    return res.json({ message: "User Not authorised" });
  }
};
