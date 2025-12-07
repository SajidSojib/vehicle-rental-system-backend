import { pool } from "../../config/db";
import changeVehicleAvailability from "../../utils/changeVehicleAvailability";
import getCustomer from "../../utils/getCustomer";
import getTotalPrice from "../../utils/getTotalPrice";
import getVehicle from "../../utils/getVehicle";
import parseDate from "../../utils/perseDate";

const createBooking = async (payload: Record<string, unknown>) => {
    const {customer_id, vehicle_id, rent_start_date, rent_end_date} = payload;
    const start_date = parseDate(rent_start_date);
    const end_date = parseDate(rent_end_date);
    const vehicle = await getVehicle(Number(vehicle_id));
    if(vehicle.rows[0].availability_status === "booked"){
        throw new Error("Vehicle is already booked");
    }
    if(vehicle.rowCount === 0){
        throw new Error("No vehicle found for this id");
    }
    const total_price = getTotalPrice(start_date, end_date, vehicle.rows[0].daily_rent_price);

    const booking = await pool.query(`INSERT INTO bookings (customer_id, vehicle_id, total_price, rent_start_date, rent_end_date) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [customer_id, vehicle_id, total_price, rent_start_date, rent_end_date]);
    
    const result = {
        id: booking.rows[0].id,
        customer_id: booking.rows[0].customer_id,
        vehicle_id: booking.rows[0].vehicle_id,
        total_price: booking.rows[0].total_price,
        status: booking.rows[0].status,
        rent_start_date: booking.rows[0].rent_start_date,
        rent_end_date: booking.rows[0].rent_end_date,
        vehicle: {
            vehicle_name: vehicle.rows[0].vehicle_name,
            daily_rent_price: vehicle.rows[0].daily_rent_price
        }
    }
    const wait =await changeVehicleAvailability(Number(vehicle_id), "booked");
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
            rent_start_date: booking.rent_start_date,
            rent_end_date: booking.rent_end_date,
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
            rent_start_date: booking.rent_start_date,
            rent_end_date: booking.rent_end_date,
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

const updateBooking = async (id: number, payload: Record<string, unknown>, modifiedBy: string, userId: number) => {
    const {status} = payload;
    console.log(id);
    const booking = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [id]);
    console.log(booking.rows[0]);
    if((status === 'returned' && modifiedBy==='admin')){
      const result = await pool.query(`UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`, [status, id]);
      changeVehicleAvailability(Number(result.rows[0].vehicle_id), "available");
      return { ...result.rows[0], vehicle: { availability_status : "available"} };
    }
    else if((status === 'cancelled' && modifiedBy === 'customer' && Number(booking.rows[0].customer_id) === userId)){
      const result = await pool.query(`UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`, [status, id]);
      changeVehicleAvailability(Number(result.rows[0].vehicle_id), "available");
      return result.rows[0];
    }
    else{
      throw new Error("Only returned status can be updated by admin and only cancelled status can be updated by customer");
    } 
}




export const bookingServices = {
    createBooking,
    getAllBookings,
    updateBooking
}