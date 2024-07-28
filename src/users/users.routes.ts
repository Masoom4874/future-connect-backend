import express, { Router } from "express";
import { verifyJwtToken } from "../utils/JWT";
import { users } from "./users.controller";
export const UserRoutes: Router = express.Router();

UserRoutes.get("/users", verifyJwtToken,users);