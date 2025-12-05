import express from "express";
import initDB from "./config/db";
import { userRoutes } from "./modules/users/user.route";
const app = express();


//** MIDDLEWARES ***/
app.use(express.json());


initDB();

//** ROUTES ***/
app.get("/", (req, res) => {
  res.send("Hello World!");
});


// user routes
app.use("/api/v1/users", userRoutes);


export default app;