import { pool } from "../../config/db";
import { autoReturnBookings } from "../../utils/autoReturnBooking";

const createVehicle = async (payload: Record<string, unknown>) => {
    const fields = Object.keys(payload);
    const values = Object.values(payload);
    const result = pool.query(`INSERT INTO vehicles (${fields.join(", ")}) VALUES (${fields.map((_, index) => `$${index + 1}`).join(", ")}) RETURNING *`, values);
    return result;
};

const getAllVehicles = async () => {
    await autoReturnBookings();
    const result = pool.query(`SELECT * FROM vehicles`);
    return result;
};

const getVehicleById = async (vehicleId: number) => {
    await autoReturnBookings();
    const result = pool.query(`SELECT * FROM vehicles WHERE id = $1`, [vehicleId]);
    return result;
};

const updateVehicle = async (vehicleId: number, payload: Record<string, unknown>) => {
    await autoReturnBookings();

    const currentVehicle = await getVehicleById(vehicleId);
    if (currentVehicle.rows[0].availability_status !== payload.availability_status && payload.availability_status === "available") {
        await pool.query(`UPDATE bookings SET status = 'returned' WHERE vehicle_id = $1 AND status = 'active'`, [vehicleId]);
    }
    const fields = Object.keys(payload);
    const values = Object.values(payload);
    const stringPair = fields.map((field, index) => `${field} = $${index + 1}`);
    const result = pool.query(`UPDATE vehicles SET ${stringPair.join(", ")} WHERE id = $${fields.length + 1} RETURNING *`, [...values, vehicleId]);
    await autoReturnBookings();
    return result;
};

const deleteVehicle = async (vehicleId: number) => {
    const result = pool.query(`DELETE FROM vehicles WHERE id = $1 RETURNING *`, [vehicleId]);
    return result;
};


export const vehicleServices = {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle
}