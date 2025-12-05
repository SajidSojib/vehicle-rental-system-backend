import express from "express";
import initDB from "./config/db";
const app = express();


//** MIDDLEWARES ***/
app.use(express.json());


initDB();

//** ROUTES ***/
app.get("/", (req, res) => {
  res.send("Hello World!");
});



export default app;