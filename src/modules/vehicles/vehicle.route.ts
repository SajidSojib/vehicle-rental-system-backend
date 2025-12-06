import { Router } from "express";
import { vehicleControllers } from "./vehicle.controller";

const router = Router();

router.post("/", vehicleControllers.createVehicle);
router.get("/", vehicleControllers.getAllVehicles);
router.get("/:vehicleId", vehicleControllers.getVehicleById);
router.put("/:vehicleId", vehicleControllers.updateVehicle);
router.delete("/:vehicleId", vehicleControllers.deleteVehicle);


export const vehicleRoutes = router;