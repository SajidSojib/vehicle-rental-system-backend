import { pool } from "../config/db";

const changeVehicleAvailability = async (vehicleId: number, availabilityStatus: 'available' | 'booked') => {
    console.log('here');
    const result = await pool.query(`UPDATE vehicles SET availability_status = $1 WHERE id = $2 RETURNING *`, [availabilityStatus, vehicleId]);
    return result;
}

export default changeVehicleAvailability