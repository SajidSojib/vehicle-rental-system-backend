import { pool } from "../../config/db";


const getAllUsers = async () => {
  const result = pool.query(`SELECT id, name, email, phone, role FROM users`);
  return result;
};

const createUser = async(payload: Record<string, unknown>) => {
    const { name, email, password, phone, role } = payload;
    const result = pool.query(`INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [name, email, password, phone, role]);
    return result;
}

const updateUser = async(userId: number, payload: Record<string, unknown>) => {
    const { name, email, password, phone, role } = payload;
    const result = pool.query(`UPDATE users SET name = $1, email = $2, password = $3, phone = $4, role = $5 WHERE id = $6 RETURNING *`, [name, email, password, phone, role, userId]);
    return result;
}

const deleteUser = async(userId: number) => {
    const result = pool.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [userId]);
    return result;
}



export const userServices = {
    createUser,
    getAllUsers,
    updateUser,
    deleteUser
}