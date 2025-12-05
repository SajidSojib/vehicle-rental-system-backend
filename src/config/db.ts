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
    
    console.log('db connected');
};

export default initDB;