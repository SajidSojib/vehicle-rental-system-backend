import { Request, Response } from "express";
import { userServices } from "./user.service";
import { autoReturnBookings } from "../../utils/autoReturnBooking";

const getAllUsers = async(req:Request, res:Response) => {
    try {
        const result = await userServices.getAllUsers();
        return res.status(200).json({success: true, message: result.rowCount ? "Users retrieved successfully" : "No users found", data: result.rows})

    } catch (error:any) {
        console.log(error);
        return res.status(500).json({success: false, message: error.message, error: error});
    }
}

const updateUser = async(req:Request, res:Response) => {
    try {
        if(Object.keys(req.body).length === 0) {
            return res.status(400).json({success: false, message: "Bad request", error: "No data provided"});
        }
        if(Number(req.params.userId) !== req.user!.id || req.user!.role !== "admin") {
            return res.status(403).json({success: false, message: "Forbidden", error: "You are not authorized to update this user"});
        }
        const result = await userServices.updateUser(Number(req.params.userId), req.body, req.user!.role);
        return res.status(200).json({success: true, message: "User updated successfully", data: result.rows[0]})
    } catch (error:any) {
        return res.status(500).json({success: false, message: error.message, error: error});
    }
}

const deleteUser = async(req:Request, res:Response) => {
    try {
        await autoReturnBookings();

        if(req.user!.role !== "admin" || req.user!.id !== Number(req.params.userId)) {
            return res.status(403).json({success: false, message: "Forbidden", error: "You are not authorized to update this user"});
        }
        const result = await userServices.deleteUser(Number(req.params.userId));
        return res.status(200).json({success: true, message: "User deleted successfully", data: result.rows[0]})
    } catch (error:any) {
        return res.status(500).json({success: false, message: error.message, error: error});
    }
}


export const userControllers = {
    getAllUsers,
    updateUser,
    deleteUser
}