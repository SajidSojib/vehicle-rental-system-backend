import { Request, Response } from "express";
import { authServices } from "./auth.service";

const signUp = async(req:Request, res:Response) => {
    try {
        const result = await authServices.signUp(req.body);
        return res.status(201).json({success: true, message: "User registered successfully", data: result.rows[0]})
    } catch (error:any) {
        return res.status(500).json({success: false, message: error.message, errors: error});
    }
}

const signIn = async(req:Request, res:Response) => {
    try {
        const result = await authServices.signIn(req.body);
        return res.status(200).json({success: true, message: "Login successful", data: result})
    } catch (error:any) {
        return res.status(500).json({success: false, message: error.message, errors: error});
    }
}


export const authControllers = {
    signUp,
    signIn
}