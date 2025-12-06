import {Pool} from "pg"
import config from ".";


export const pool = new Pool({
  connectionString: config.connection_string,
  ssl: { rejectUnauthorized: false },
});

const initDB = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE CHECK (email = LOWER(email)),
            password TEXT NOT NULL CHECK (LENGTH(password) >= 6),
            phone VARCHAR(15) NOT NULL,
            role VARCHAR(15) NOT NULL CHECK (role IN ('admin', 'customer'))
        );`);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles (
            id SERIAL PRIMARY KEY,
            vehicle_name VARCHAR(255) NOT NULL,
            type VARCHAR(5) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
            registration_number VARCHAR(255) NOT NULL UNIQUE,
            daily_rent_price INT NOT NULL CHECK (daily_rent_price > 0),
            availability_status VARCHAR(15) DEFAULT 'available' CHECK (availability_status IN ('available', 'booked'))
        )`);
    
    console.log('db connected');
};

export default initDB;