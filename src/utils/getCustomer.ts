import { pool } from "../config/db";

const getCustomer = async (customerId: number) => {
    const result = pool.query(`SELECT * FROM users WHERE id = $1 AND role = 'customer'`, [customerId]);
    return result;
};

export default getCustomer;