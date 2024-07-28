import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { createAccessToken } from "../utils/JWT";
import User from "../users/User.model";
import UserService from "../users/User.service";


const userService = new UserService();

export const login = async (req: any, res: Response) => {
  let { email, password } = req.body;

  const user = await userService.findUserByEmail(email);
  if (user) {
    if (bcrypt.compareSync(password, user.password)) {
      let token = await createAccessToken(user.id);

      user.password = "";

      res
        .status(200)
        .json({ success: true, result: user, token, message: "Logged in" });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }
  } else {
    res.status(401).json({ success: false, message: "User Not Exists" });
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    let user = await User.findOne({
      where: { email }
    });

    if (user) {
      res.status(400).json({
        success: false,
        message: "User Already Exists with this email",
      });
    } else {
      const encpass = bcrypt.hashSync(password, 1);

      user = await userService.createUser({
        email,
        password: encpass,
        name

      });

      if (user) {
        res.status(201).json({
          success: true,
          message: "User has been created",
          result: user,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "unable to create user",
        });
      }
    }
  } catch (error) {
    res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};


export const forgetpassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    let user = await userService.findUserByEmail(email)
    if (user) {
      await userService.sendforgetotp(email);
      res.status(300).json({
        success: true,
        message: "Verification Mail has been sent on your email",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Your email is not registered with US",
      });


    }
  } catch (error) {
    res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};


export const changepassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, password } = req.body;
    let user = await userService.verifyAndChangePassword(email, otp, password);
    if (user) {
      res.status(300).json({
        success: true,
        message: "Password has been changed",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to change password",
      });


    }
  } catch (error) {
    res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};


