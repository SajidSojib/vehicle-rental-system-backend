import express from "express";
import initDB from "./config/db";
import { userRoutes } from "./modules/users/user.route";
import { authRoutes } from "./modules/auth/auth.route";
const app = express();


//** MIDDLEWARES ***/
app.use(express.json());


initDB();

//** ROUTES ***/
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use(`/api/v1/users`, userRoutes);
app.use(`/api/v1/auth`, authRoutes);



export default app;