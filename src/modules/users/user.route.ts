import { Router } from "express";
import { userControllers } from "./user.controller";

const router = Router();

router.get("/", userControllers.getAllUsers);
router.post("/", userControllers.createUser);
router.put("/:userId", userControllers.updateUser);
router.delete("/:userId", userControllers.deleteUser);



export const userRoutes = router;