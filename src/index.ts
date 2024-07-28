import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

import { testConnection } from './utils/DBCONNECTION';
import User from "./users/User.model";
import morgan from "morgan";
dotenv.config();

const mainRoutes = require("./mainRoutes.routes");

const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: "*",
  })
);

app.use(morgan('combined'))

app.use(express.json({ limit: "500mb" }));


// ############### === DB CONNECTION === ########################

const connect = async () => {
  await testConnection();
  await User.sync({}); // This will drop the table if it already exists and create a new one
  console.log('User table has been created.');
};

connect()


// ############### === DB CONNECTION END === ########################

app.use("/api", mainRoutes);

// Status Check
app.get("/", (req, res) => {
  res.send("Serving on port" + port);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
