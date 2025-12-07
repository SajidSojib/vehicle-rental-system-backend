import { pool } from "../config/db";

const changeVehicleAvailability = async (vehicleId: number, availabilityStatus: 'available' | 'booked') => {
    const result = pool.query(`UPDATE vehicles SET availability_status = $1 WHERE id = $2 RETURNING *`, [availabilityStatus, vehicleId]);
}

export default changeVehicleAvailability