import { pool } from "../config/db";

export const autoReturnBookings = async () => {
  await pool.query(`
      UPDATE bookings
      SET status = 'returned'
      WHERE rent_end_date < CURRENT_DATE
      AND status = 'active'
  `);

  await pool.query(`
      UPDATE vehicles
      SET availability_status = 'available'
      WHERE id NOT IN (
          SELECT vehicle_id FROM bookings WHERE status = 'active'
      )
  `);
};

