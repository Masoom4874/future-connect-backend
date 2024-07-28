import express, { Router } from "express";
import { verifyJwtToken } from "../utils/JWT";
import { changepassword, forgetpassword, login, signup} from "./auth.controllers";
export const AuthRoutes: Router = express.Router();



AuthRoutes.post("/login", login);
AuthRoutes.post("/signup", signup);
AuthRoutes.post("/foget-password", forgetpassword);
AuthRoutes.post("/change-password", changepassword);















