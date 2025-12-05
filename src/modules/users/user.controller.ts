import { Request, Response } from "express";
import { userServices } from "./user.service";

const getAllUsers = async(req:Request, res:Response) => {
    try {
        const result = await userServices.getAllUsers();
        return res.status(200).json({success: true, message: result.rowCount ? "Users retrieved successfully" : "No users found", data: result.rows})

    } catch (error:any) {
        console.log(error);
        return res.status(500).json({success: false, message: 'user retrieval failed', error: error.message});
    }
}

const updateUser = async(req:Request, res:Response) => {
    try {
        const result = await userServices.updateUser(Number(req.params.userId), req.body);
        return res.status(200).json({success: true, message: "User updated successfully", data: result.rows[0]})
    } catch (error:any) {
        return res.status(500).json({success: false, message: 'user update failed', error: error.message});
    }
}

const deleteUser = async(req:Request, res:Response) => {
    try {
        if(req.user!.role !== "admin" || req.user!.id !== Number(req.params.userId)) {
            return res.status(403).json({success: false, message: "Forbidden", error: "You are not authorized to update this user"});
        }
        const result = await userServices.deleteUser(Number(req.params.userId));
        return res.status(200).json({success: true, message: "User deleted successfully", data: result.rows[0]})
    } catch (error:any) {
        return res.status(500).json({success: false, message: 'user deletion failed', error: error.message});
    }
}


export const userControllers = {
    getAllUsers,
    updateUser,
    deleteUser
}