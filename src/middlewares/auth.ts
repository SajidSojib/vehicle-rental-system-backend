import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import { pool } from "../config/db";


const auth = (...roles: ("admin" | "customer")[]) =>{
    return async(req:Request, res:Response, next:NextFunction) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                return res.status(401).json({success: false, message: "Unauthorized", error: "Missing or invalid authentication token"});
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

            const user = await pool.query(`SELECT email FROM users WHERE id = $1`, [decoded.id]);
            if (user.rows.length === 0) {
                return res.status(401).json({success: false, message: "Unauthorized", error: "User not found"});
            }

            if (!roles.includes(decoded.role)) {
                return res.status(403).json({success: false, message: "Forbidden", error: "You are not authorized to access this resource"});
            }

            req.user = decoded;
            next();
        } catch (error:any) {
            return res.status(500).json({success: false, message: error.message, errors: error});
        }
    }
}

export default auth;