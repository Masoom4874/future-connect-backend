import { NextFunction, Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import UserService from "../users/User.service";

const userService = new UserService();

export const createAccessToken = async (
  userId: any,
): Promise<string> => {
  let token = sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: '5m' 
  });
  return token;
};

export const verifyJwtToken = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization: string = req.headers.authorization || "";

    if (authorization) {
      const token = authorization.split(" ")[1];
      const payload: any =  verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!
      );
      if (payload != undefined) {
        let user: any;
         
        user =  userService.getUserByID(payload.userId)

        if (user != null) {
          req.body.user= user._id;
          return next();
        } else {
          res
            .status(401)
            .json({ success: false, message: "You are not authenticated." });
        }
      } else {
        res
          .status(401)
          .json({ success: false, message: "You are not authenticated." });
      }
    } else {
      res
        .status(401)
        .json({ success: false, message: "You are not authenticated." });
    }
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "You are not authenticated." });
  }
};