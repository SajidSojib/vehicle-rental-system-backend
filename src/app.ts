import express, { NextFunction, Request, Response } from "express";
import initDB from "./config/db";
import { userRoutes } from "./modules/users/user.route";
import { authRoutes } from "./modules/auth/auth.route";
import { vehicleRoutes } from "./modules/vehicles/vehicle.route";
import { bookingRoutes } from "./modules/bookings/booking.route";
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
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/bookings', bookingRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    error: 'The route you are looking for does not exist',
  });
});
export default app;