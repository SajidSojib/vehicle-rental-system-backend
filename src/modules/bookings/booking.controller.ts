import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

const createBooking = async(req:Request, res:Response) => {
    try {
        const result = await bookingServices.createBooking(req.body);
        return res
          .status(201)
          .send({
            success: true,
            message: "Booking created successfully",
            data: result,
          });
    } catch (error: any) {
        return res.status(500).json({success: false, message: error.message, error: error});
    }
}

const getAllBookings = async(req:Request, res:Response) => {
    try {
        const modifiedBy = req.user!.role;
        const userId = req.user!.id;
        const result = await bookingServices.getAllBookings(modifiedBy, Number(userId));
        if(result?.length) {
            return res.status(200).json({success: true, message: "No bookings exists", data: result})
        }
        return res.status(200).json({success: true, message: "Bookings retrieved successfully", data: result})
    } catch (error:any) {
        return res.status(500).json({success: false, message: 'booking retrieval failed', error: error.message});
    }
}

const updateBooking = async(req:Request, res:Response) => {
    try {
        const bookingId = Number(req.params.id);
        const modifiedBy = req.user!.role;
        const result = await bookingServices.updateBooking(bookingId, req.body, modifiedBy);
        
        if(modifiedBy === 'admin'){
            return res.status(200).json({
                success: true,
                message: "Booking marked as returned. Vehicle is now available",
                data: result,
              });
        }

        return res.status(200).json({
          success: true,
          message: "Booking cancelled successfully",
          data: result,
        });

    } catch (error:any) {
        return res.status(500).json({success: false, message: error.message, error: error});
    }
}

export const bookingController = {createBooking, getAllBookings, updateBooking}