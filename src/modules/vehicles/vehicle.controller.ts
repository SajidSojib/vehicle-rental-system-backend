import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";
import { autoReturnBookings } from "../../utils/autoReturnBooking";

const createVehicle = async (req:Request, res:Response) => {
    try {
        if(Object.keys(req.body).length === 0) {
            return res.status(400).json({success: false, message: "Bad request", error: "No data provided"});
        }
        const result = await vehicleServices.createVehicle(req.body);
        return res.status(201).json({success: true, message: "Vehicle created successfully", data: result.rows[0]})
    } catch (error:any) {
        return res.status(500).json({success: false, message: error.message, error: error});
    }
}

const getAllVehicles = async(req:Request, res:Response) => {
    try {
        const result = await vehicleServices.getAllVehicles();
        return res.status(200).json({success: true, message: result.rowCount ? "Vehicles retrieved successfully" : "No vehicles found", data: result.rows})

    } catch (error:any) {
        return res.status(500).json({success: false, message: error.message, error: error});
    }
}

const getVehicleById = async(req:Request, res:Response) => {
    try {
        const result = await vehicleServices.getVehicleById(Number(req.params.vehicleId));
        return res.status(200).json({success: true, message: result.rowCount ? "Vehicle retrieved successfully" : "No vehicle found for this id", data: result.rows[0]})

    } catch (error:any) {
        return res.status(500).json({success: false, message: error.message, error: error});
    }
}

const updateVehicle = async(req:Request, res:Response) => {
    try {
        if(Object.keys(req.body).length === 0) {
            return res.status(400).json({success: false, message: "Bad request", error: "No data provided"});
        }
        const result = await vehicleServices.updateVehicle(Number(req.params.vehicleId), req.body);
        return res.status(200).json({success: true, message: "Vehicle updated successfully", data: result.rows[0]})
    } catch (error:any) {
        return res.status(500).json({success: false, message: 'vehicle update failed', error: error.message});
    }
}

const deleteVehicle = async(req:Request, res:Response) => {
    try {
        await autoReturnBookings();
        const vehicle = await vehicleServices.getVehicleById(Number(req.params.vehicleId));

        if(vehicle.rowCount === 0) {
            return res.status(404).json({success: false, message: "Vehicle not found", error: "No vehicle found for this id"});
        }
        if (vehicle.rows[0].availability_status === "booked") {
          return res.status(403).json({
              success: false,
              message: "Forbidden",
              error: "Vehicle is currently booked",
            });
        }

        const result = await vehicleServices.deleteVehicle(
          Number(req.params.vehicleId)
        );
        return res.status(200).json({success: true, message: "Vehicle deleted successfully", data: result.rows[0]})
    } catch (error:any) {
        return res.status(500).json({success: false, message: 'vehicle deletion failed', error: error.message});
    }
}

export const vehicleControllers = {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle
}