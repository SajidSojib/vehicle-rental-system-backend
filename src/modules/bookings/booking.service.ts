import { pool } from "../../config/db";
import changeVehicleAvailability from "../../utils/changeVehicleAvailability";
import getCustomer from "../../utils/getCustomer";
import getTotalPrice from "../../utils/getTotalPrice";
import getVehicle from "../../utils/getVehicle";
import parseDate from "../../utils/perseDate";

const createBooking = async (payload: Record<string, unknown>) => {
    const {customer_id, vehicle_id, rental_start_date, rental_end_date} = payload;
    const start_date = parseDate(rental_start_date);
    const end_date = parseDate(rental_end_date);
    
    const vehicle = await getVehicle(Number(vehicle_id));
    if(vehicle.rows[0].availability_status === "booked"){
        throw new Error("Vehicle is already booked");
    }
    const total_price = getTotalPrice(start_date, end_date, vehicle.rows[0].daily_rent_price);

    const booking = await pool.query(`INSERT INTO bookings (customer_id, vehicle_id, total_price, status, rental_start_date, rental_end_date) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [customer_id, vehicle_id, total_price, start_date, end_date]);
    
    const result = {
        id: booking.rows[0].id,
        customer_id: booking.rows[0].customer_id,
        vehicle_id: booking.rows[0].vehicle_id,
        total_price: booking.rows[0].total_price,
        status: booking.rows[0].status,
        rental_start_date: booking.rows[0].rental_start_date,
        rental_end_date: booking.rows[0].rental_end_date,
        vehicle: {
            vehicle_name: vehicle.rows[0].vehicle_name,
            daily_rent_price: vehicle.rows[0].daily_rent_price
        }
    }
    changeVehicleAvailability(Number(vehicle_id), "booked");
    return result;
}

const getAllBookings = async (modifiedBy: string, userId: number) => {
    if(modifiedBy === "admin"){
        const bookings = await pool.query(`SELECT * FROM bookings`);
        const result = bookings.rows.map(async (booking) => {
          const customer = await getCustomer(booking.customer_id);
          const vehicle = await getVehicle(booking.vehicle_id);
          return {
            id: booking.id,
            customer_id: booking.customer_id,
            vehicle_id: booking.vehicle_id,
            total_price: booking.total_price,
            status: booking.status,
            rental_start_date: booking.rental_start_date,
            rental_end_date: booking.rental_end_date,
            customer: {
              name: customer.rows[0].name,
              email: customer.rows[0].email,
            },
            vehicle: {
              vehicle_name: vehicle.rows[0].vehicle_name,
              registration_number: vehicle.rows[0].registration_number,
            },
          };
        });
        return await Promise.all(result);
    }
    else if(modifiedBy === 'customer'){
        const bookings = await pool.query(`SELECT * FROM bookings WHERE customer_id = $1`, [userId]);
        const result = bookings.rows.map(async (booking) => {
          const vehicle = await getVehicle(booking.vehicle_id);
          return {
            id: booking.id,
            customer_id: booking.customer_id,
            vehicle_id: booking.vehicle_id,
            total_price: booking.total_price,
            status: booking.status,
            rental_start_date: booking.rental_start_date,
            rental_end_date: booking.rental_end_date,
            vehicle: {
              vehicle_name: vehicle.rows[0].vehicle_name,
              registration_number: vehicle.rows[0].registration_number,
              type: vehicle.rows[0].type
            },
          };
        });
        return await Promise.all(result);
    }
}

const updateBooking = async (id: number, payload: Record<string, unknown>, modifiedBy: string) => {
    const {status} = payload;
    if(modifiedBy === "admin"){
        if(status !== 'returned'){
            throw new Error("Only returned status can be updated by admin");
        }
        const result = await pool.query(`UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`, [status, id]);
        changeVehicleAvailability(Number(result.rows[0].vehicle_id), "available");
        return { ...result.rows[0], vehicle: { availability_status : "available"} };
    }
    else if(modifiedBy === "customer"){
        if(status !== 'cancelled'){
            throw new Error("Only cancelled status can be updated by customer");
        }
        const result = await pool.query(`UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`, [status, id]);
        changeVehicleAvailability(Number(result.rows[0].vehicle_id), "available");
        return result.rows[0];
    } 
}




export const bookingServices = {
    createBooking,
    getAllBookings,
    updateBooking
}