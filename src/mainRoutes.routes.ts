import express, { Router } from "express";
import { AuthRoutes } from "./auth/auth.routes";
import { UserRoutes } from "./users/users.routes";

const app = express();

app.use("/auth", AuthRoutes);
app.use("/user", UserRoutes);





module.exports = app;
