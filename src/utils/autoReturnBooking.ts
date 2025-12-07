import { pool } from "../config/db";

export const autoReturnBookings = async () => {
  await pool.query(`
        UPDATE bookings
        SET status = 'returned'
        WHERE status = 'active'
        AND rental_end_date < CURRENT_DATE
    `);

  await pool.query(`
        UPDATE vehicles
        SET availability_status = 'available'
        WHERE id IN (
            SELECT vehicle_id FROM bookings
            WHERE status = 'returned'
        )
    `);
};
