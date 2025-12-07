import { pool } from "../config/db";

const getVehicle = async (vehicleId: number) => {
    const result = pool.query(`SELECT * FROM vehicles WHERE id = $1`, [vehicleId]);
    return result;
};

export default getVehicle;