import { Request, Response } from "express";
import { authServices } from "./auth.service";

const signUp = async(req:Request, res:Response) => {
    try {
        const result = await authServices.signUp(req.body);
        return res.status(200).json({success: true, message: "User registered successfully", data: result.rows[0]})
    } catch (error:any) {
        return res.status(500).json({success: false, message: 'user registration failed', error: error.message});
    }
}

const signIn = async(req:Request, res:Response) => {
    try {
        const result = await authServices.signIn(req.body);
        return res.status(200).json({success: true, message: "Login successful", data: result.rows[0]})
    } catch (error:any) {
        return res.status(500).json({success: false, message: 'user login failed', error: error.message});
    }
}


export const authControllers = {
    signUp,
    signIn
}