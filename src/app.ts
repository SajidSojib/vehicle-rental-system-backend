import express from "express";
import initDB from "./config/db";
import { userRoutes } from "./modules/users/user.route";
import { authRoutes } from "./modules/auth/auth.route";
import config from "./config";
const app = express();


//** MIDDLEWARES ***/
app.use(express.json());


initDB();

//** ROUTES ***/
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use(`${config.baseURL}/users`, userRoutes);
app.use(`${config.baseURL}/auth`, authRoutes);


export default app;